from fastapi import FastAPI, Depends, HTTPException, Body, Form, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import desc
from typing import Union
from .database import SessionLocal, engine
from . import models, schemas
import logging
import base64
import shutil
import os
from datetime import date
import urllib.parse
import subprocess
from server.settings import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

models.Base.metadata.create_all(bind=engine)

logger = logging.getLogger(__name__)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

TARGET_URL = "https://www.se.kmitl.ac.th/"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route to get all forums from a specific board
@app.get("/coboard/{board}/", response_model=schemas.BoardResponse)
async def get_forums(board: str, db: Session = Depends(get_db)):
    try:
        forums = db.query(models.Forum).filter(models.Forum.board == board).order_by(desc(models.Forum.forum_id)).all()
        
        forum_data = []
        for forum in forums:
            # Prepare the forum data dictionary
            forum_dict = forum.__dict__.copy()
            forum_dict['icon'] = base64.b64encode(forum.icon).decode('utf-8') if forum.icon else None

            # Calculate total contributors
            topics = db.query(models.Topic).join(models.ForumTopic).filter(
                models.ForumTopic.forum_id == forum.forum_id
            ).all()
            contributors_set = set()

            for topic in topics:
                posts = db.query(models.Post).join(models.TopicPost).filter(
                    models.TopicPost.topic_id == topic.topic_id
                ).all()
                for post in posts:
                    contributors_set.add(post.spost_creator or post.apost_creator)
                    comments = db.query(models.Comment).join(models.PostComment).filter(
                        models.PostComment.post_id == post.post_id
                    ).all()
                    for comment in comments:
                        contributors_set.add(comment.scomment_creator or comment.acomment_creator)

            contributors_set.discard(forum.creator_id)
            forum_dict['total_contributors'] = len(contributors_set)  # Add total contributors count
            
            forum_data.append(schemas.ForumWithContributors(**forum_dict))  # Use the new schema

        # Fetch tags, forumtag, and access data as usual
        tags = db.query(models.Tag).filter(models.Tag.board == board).order_by(desc(models.Tag.use)).all()
        tag_data = [schemas.Tag(**tag.__dict__) for tag in tags]

        forum_ids = [forum.forum_id for forum in forums]
        forumtag = db.query(models.ForumTag).filter(models.ForumTag.forum_id.in_(forum_ids)).all()
        forumtag_data = [schemas.ForumTag(**ft.__dict__) for ft in forumtag]

        access = db.query(models.Access).filter(models.Access.forum_id.in_(forum_ids)).all()
        access_data = [schemas.Access(**a.__dict__) for a in access]

        # Return data with forums using ForumWithContributors schema
        return schemas.BoardResponse(forums=forum_data, tags=tag_data, forumtag=forumtag_data, access=access_data)

    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching forums: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error while fetching forums: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# Route to post new forum in specific board
@app.post("/coboard/{board}/", response_model=schemas.Forum)
async def create_forum(
    board: str,
    forum: schemas.ForumCreate,
    db: Session = Depends(get_db)
):
    try:
        if board != forum.board:
            raise HTTPException(status_code=400, detail="Board in URL doesn't match board in forum data")
        
        icon_data = None
        if forum.icon:
            try:
                icon_data = base64.b64decode(forum.icon)
                if len(icon_data) > 1048576:
                    raise HTTPException(status_code=400, detail="Icon file too large")
            except base64.binascii.Error:
                raise HTTPException(status_code=400, detail="Invalid base64 for icon")
        
        # Create the new forum instance
        new_forum = models.Forum(
            forum_name=forum.forum_name,
            description=forum.description,
            creator_id=forum.creator_id,
            created_time=forum.created_time,
            wallpaper=forum.wallpaper,
            font=forum.font,
            sort_by=forum.sort_by,
            slug=forum.slug,
            board=forum.board,
            icon=icon_data
        )
        
        # Add the forum to the session and commit to get the forum_id
        db.add(new_forum)
        db.commit()  # This will generate the forum_id
        db.refresh(new_forum)  # Refresh to get the updated object
        
        # Handle tags if provided
        if hasattr(forum, 'tags') and forum.tags is not None:
            for tag in forum.tags:
                tag_exists = db.query(models.Tag).filter(models.Tag.tag_id == tag.tag_id).first()
                if tag_exists:
                    new_forum_tag = models.ForumTag(
                        forum_id=new_forum.forum_id,
                        tag_id=tag.tag_id
                    )
                    db.add(new_forum_tag)
                    tag_exists.use += 1
                else:
                    db.rollback()
                    raise HTTPException(status_code=400, detail=f"Tag with ID {tag.tag_id} does not exist")
        
        # Commit the tags
        db.commit()
        
        # Prepare response data
        response_data = {
            "forum_id": new_forum.forum_id,
            "forum_name": new_forum.forum_name,
            "description": new_forum.description,
            "creator_id": new_forum.creator_id,
            "created_time": new_forum.created_time,
            "wallpaper": new_forum.wallpaper,
            "font": new_forum.font,
            "sort_by": new_forum.sort_by,
            "slug": new_forum.slug,
            "board": new_forum.board,
        }
        
        if new_forum.icon:
            response_data['icon'] = base64.b64encode(new_forum.icon).decode('utf-8')
        
        return schemas.Forum(**response_data)
    
    except SQLAlchemyError as e:
        db.rollback()
        error_msg = f"Database error while creating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        error_msg = f"Unexpected error while creating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

# Route to get all topics and forum detail from a specific forum
@app.get("/coboard/{board}/{forum_name}/", response_model=schemas.ForumResponse)
async def get_topics(
    board: str,
    forum_name: str,
    db: Session = Depends(get_db)
):
    try:
        db_forum = db.query(models.Forum).filter(
            models.Forum.board == board,
            models.Forum.slug == forum_name
        ).first()
        
        if not db_forum:
            raise HTTPException(status_code=404, detail="Forum not found")
        
        response_data = db_forum.__dict__.copy()
        if db_forum.icon:
            response_data['icon'] = base64.b64encode(db_forum.icon).decode('utf-8')

        user = db.query(models.SEUser).filter(models.SEUser.sid == db_forum.creator_id).first()

        if user.username :
            response_data['creator'] = user.username

        # Fetch associated tags
        tags = db.query(models.Tag).join(models.ForumTag).filter(
            models.ForumTag.forum_id == db_forum.forum_id
        ).all()
        tag_data = [tag.__dict__.copy() for tag in tags]

        board_tag = db.query(models.Tag).filter(models.Tag.board == board).order_by(desc(models.Tag.use)).all()
        board_tag_data = [bt.__dict__.copy() for bt in board_tag]

        sbookmark = db.query(models.SBookmark).filter(models.SBookmark.forum_id == db_forum.forum_id).all()
        sbookmark_data = [sbm.__dict__.copy() for sbm in sbookmark]

        abookmark = db.query(models.ABookmark).filter(models.ABookmark.forum_id == db_forum.forum_id).all()
        abookmark_data = [abm.__dict__.copy() for abm in abookmark]

        access = db.query(models.Access).filter(models.Access.forum_id == db_forum.forum_id).all()
        access_data = [schemas.Access(**a.__dict__) for a in access]
        
        # Fetch topics associated with the forum
        topics = db.query(models.Topic).join(models.ForumTopic).filter(
            models.ForumTopic.forum_id == db_forum.forum_id
        ).all()
        
        topic_data = []
        for topic in topics:
            topic_dict = topic.__dict__.copy()
            
            # Fetch posts for each topic
            posts = db.query(models.Post).join(models.TopicPost).filter(
                models.TopicPost.topic_id == topic.topic_id
            ).all()
            
            post_data = []
            for post in posts:
                post_dict = post.__dict__.copy()
                post_dict['pic'] = base64.b64encode(post.pic).decode('utf-8') if post.pic else None
                
                # Fetch comments for each post
                comments = db.query(models.Comment).join(models.PostComment).filter(
                    models.PostComment.post_id == post.post_id
                ).all()
                post_dict['comments'] = [comment.__dict__.copy() for comment in comments]
                
                # Fetch files for each post
                files = db.query(models.File).filter(models.File.post_id == post.post_id).all()               
                post_dict['files'] = [file.__dict__.copy() for file in files]

                post_data.append(post_dict)
            
            topic_dict['posts'] = post_data
            topic_data.append(topic_dict)

        response_data['btags'] = board_tag_data
        response_data['tags'] = tag_data
        response_data['topics'] = topic_data
        response_data['sbookmarks'] = sbookmark_data
        response_data['abookmarks'] = abookmark_data
        response_data['access'] = access_data
        return schemas.ForumResponse(**response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to post new topic
@app.post("/coboard/{board}/{forum_name}/topic", response_model=schemas.Topic)
async def create_topic(board: str, forum_name: str, topic_data: schemas.TopicCreate, db: Session = Depends(get_db)):
    forum = db.query(models.Forum).filter(
        models.Forum.board == board,
        models.Forum.slug == forum_name
    ).first()

    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    new_topic = models.Topic(text=topic_data.text, publish=topic_data.publish, expired=topic_data.expired)
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    forum_topic = models.ForumTopic(forum_id=forum.forum_id, topic_id=new_topic.topic_id)
    db.add(forum_topic)
    db.commit()

    forum.last_updated = date.today()
    db.commit()

    return new_topic

# Route to update forum
@app.put("/coboard/{board}/{forum_name}/setting", response_model=schemas.ForumResponse)
async def update_forum(
    board: str,
    forum_name: str,
    forum: schemas.ForumCreate,
    db: Session = Depends(get_db),
):
    try:
        # Fetch the existing forum from the database
        db_forum = db.query(models.Forum).filter(
            models.Forum.board == board,
            models.Forum.slug == forum_name
        ).first()
        
        if not db_forum:
            raise HTTPException(status_code=404, detail="Forum not found")

        # Update forum attributes, including the icon
        for key, value in forum.dict(exclude_unset=True).items():
            if key == 'icon' and value:
                try:
                    # Decode the Base64 icon and validate its size
                    decoded_icon = base64.b64decode(value)
                    if len(decoded_icon) > 1048576:  # Limit to 1 MB
                        raise HTTPException(status_code=400, detail="Icon file too large")
                    db_forum.icon = decoded_icon
                except base64.binascii.Error:
                    raise HTTPException(status_code=400, detail="Invalid base64 for icon")
            elif key != 'tags':  # Skip 'tags' as they will be handled separately
                setattr(db_forum, key, value)

        # Handle tags update
        if hasattr(forum, 'tags') and forum.tags is not None:
            # Remove all existing tags
            existing_tags = db.query(models.ForumTag).filter(models.ForumTag.forum_id == db_forum.forum_id).all()
            existing_tag_ids = {tag.tag_id for tag in existing_tags}

            # Add new tags
            for tag in forum.tags:
                if tag.tag_id not in existing_tag_ids:
                    new_forum_tag = models.ForumTag(
                        forum_id=db_forum.forum_id,
                        tag_id=tag.tag_id
                    )
                    db.add(new_forum_tag)

                    # Increment use count for the new tag
                    tagupdate = db.query(models.Tag).filter(models.Tag.tag_id == tag.tag_id).first()
                    if tagupdate:
                        tagupdate.use += 1

        db_forum.last_updated = date.today()

        # Commit the changes to the database
        db.commit()
        db.refresh(db_forum)

        # Prepare response data
        response_data = db_forum.__dict__.copy()
        if db_forum.icon:
            response_data['icon'] = base64.b64encode(db_forum.icon).decode('utf-8')

        user = db.query(models.SEUser).filter(models.SEUser.sid == db_forum.creator_id).first()

        if user.username :
            response_data['creator'] = user.username

        # Fetch updated tags
        tags = db.query(models.Tag).join(models.ForumTag).filter(
            models.ForumTag.forum_id == db_forum.forum_id
        ).all()
        tag_data = [tag.__dict__.copy() for tag in tags]

        # Fetch board tags
        board_tags = db.query(models.Tag).filter(models.Tag.board == board).order_by(desc(models.Tag.use)).all()
        board_tag_data = [bt.__dict__.copy() for bt in board_tags]

        # Fetch topics
        topics = db.query(models.Topic).join(models.ForumTopic).filter(
            models.ForumTopic.forum_id == db_forum.forum_id
        ).all()
        topic_data = [topic.__dict__.copy() for topic in topics]

        sbookmark = db.query(models.SBookmark).filter(models.SBookmark.forum_id == db_forum.forum_id).all()
        sbookmark_data = [sbm.__dict__.copy() for sbm in sbookmark]

        abookmark = db.query(models.ABookmark).filter(models.ABookmark.forum_id == db_forum.forum_id).all()
        abookmark_data = [abm.__dict__.copy() for abm in abookmark]

        access = db.query(models.Access).filter(models.Access.forum_id == db_forum.forum_id).all()
        access_data = [schemas.Access(**a.__dict__) for a in access]

        response_data['tags'] = tag_data
        response_data['btags'] = board_tag_data
        response_data['topics'] = topic_data
        response_data['sbookmarks'] = sbookmark_data
        response_data['abookmarks'] = abookmark_data
        response_data['access'] = access_data
        return schemas.ForumResponse(**response_data)

    except SQLAlchemyError as e:
        db.rollback()
        error_msg = f"Database error while updating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        error_msg = f"Unexpected error while updating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

# Route to create post 
@app.post("/coboard/{board}/{forum_name}/post", response_model=schemas.Post)
async def create_post(
    board: str,
    forum_name: str,
    post_data: schemas.PostCreate,
    topic_id: int,
    db: Session = Depends(get_db)
):
    # First, find the forum
    forum = db.query(models.Forum).filter(
        models.Forum.board == board,
        models.Forum.slug == forum_name
    ).first()
    
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    # Then, find the topic
    topic = db.query(models.Topic).filter(
        models.Topic.topic_id == topic_id,
    ).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    pic_data = None
    if post_data.pic:
        try:
            pic_data = base64.b64decode(post_data.pic)
            if len(pic_data) > 1048576:
                raise HTTPException(status_code=400, detail="Icon file too large")
        except base64.binascii.Error:
            raise HTTPException(status_code=400, detail="Invalid base64 for icon")

    # Create new post
    new_post = models.Post(
        post_head=post_data.post_head,
        post_body=post_data.post_body,
        heart=post_data.heart,
        spost_creator=post_data.spost_creator,
        apost_creator=post_data.apost_creator,
        pic=pic_data
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    # Create relationship between topic and post
    topic_post = models.TopicPost(topic_id=topic.topic_id, post_id=new_post.post_id)
    db.add(topic_post)
    db.commit()

    forum.last_updated = date.today()
    db.commit()

    response_data = {
            "post_id": new_post.post_id,
            "post_head": new_post.post_head,
            "post_body": new_post.post_body,
            "heart": new_post.heart,
            "spost_creator": new_post.spost_creator,
            "apost_creator": new_post.apost_creator,
        }

    if new_post.pic:
        response_data['pic'] = base64.b64encode(new_post.pic).decode('utf-8')

    return schemas.Post(**response_data)

# Route to update like
@app.put("/coboard/{board}/{forum_name}/like", response_model=schemas.LikeResponse)
async def update_like(
    board: str,
    forum_name: str,
    like_data: schemas.LikeUpdate,
    db: Session = Depends(get_db)
):
    try:
        if like_data.item_type == "post":
            item = db.query(models.Post).filter(models.Post.post_id == like_data.item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail="Post not found")
            item.heart += 1
        elif like_data.item_type == "comment":
            item = db.query(models.Comment).filter(models.Comment.comment_id == like_data.item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail="Comment not found")
            item.comment_heart += 1
        else:
            raise HTTPException(status_code=400, detail="Invalid item type")

        db.commit()
        db.refresh(item)

        return schemas.LikeResponse(
            item_id=item.post_id if like_data.item_type == "post" else item.comment_id,
            item_type=like_data.item_type,
            likes=item.heart if like_data.item_type == "post" else item.comment_heart
        )

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error while updating like: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error while updating like: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
# Route to add comment
@app.post("/coboard/{board}/{forum_name}/comment", response_model=schemas.Comment)
async def add_comment(
    board: str,
    forum_name: str,
    comment_data: schemas.CommentCreate,
    post_id: int,
    db: Session = Depends(get_db)
):
    try:
        post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        new_comment = models.Comment(comment_text=comment_data.comment_text, scomment_creator=comment_data.scomment_creator, acomment_creator=comment_data.acomment_creator )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)

        post_comment = models.PostComment(post_id=post.post_id, comment_id=new_comment.comment_id)
        db.add(post_comment)
        db.commit()

        return new_comment

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error while adding comment: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error while adding comment: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
# Route to get all users
@app.get("/", response_model=schemas.UserResponse)
async def get_user(db: Session = Depends(get_db)):
    try:
        # Fetch SE users
        se_users = db.query(models.SEUser).all()
        se_data = []
        for user in se_users:
            user_dict = user.__dict__.copy()
            if user.sprofile:
                user_dict['sprofile'] = base64.b64encode(user.sprofile).decode('utf-8')
            else:
                user_dict['sprofile'] = None
            se_data.append(schemas.SEUser(**user_dict))

        # Fetch anonymous users
        anonymous_users = db.query(models.AnonymousUser).all()
        anonymous_data = []
        for user in anonymous_users:
            user_dict = user.__dict__.copy()
            if user.aprofile:
                user_dict['aprofile'] = base64.b64encode(user.aprofile).decode('utf-8')
            else:
                user_dict['aprofile'] = None
            anonymous_data.append(schemas.AnonymousUser(**user_dict))
        
        # Return the data wrapped in the response schema
        return schemas.UserResponse(se=se_data, anonymous=anonymous_data)

    except SQLAlchemyError as e:
        logger.error(f"Database error while fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        logger.error(f"Unexpected error while fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
# Route to add Bookmark
@app.post("/coboard/{board}/{forum_name}", response_model=Union[schemas.SBookmark, schemas.ABookmark])
async def create_bookmark(
    board: str, 
    forum_name: str, 
    bookmark: schemas.BookmarkCreate=Body(...),
    db: Session = Depends(get_db)):
    try:
        user_id = bookmark.user_id
        status = bookmark.status
        forum = db.query(models.Forum).filter(models.Forum.slug == forum_name).first()
        if not forum:
            raise HTTPException(status_code=404, detail="Forum not found")
        
        if status == "se":
            user = db.query(models.SEUser).filter(models.SEUser.sid == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            new_bookmark = models.SBookmark(forum_id=forum.forum_id, user_id=user.sid)
            db.add(new_bookmark)
            db.commit()
            db.refresh(new_bookmark)

            return new_bookmark
        else:
            user = db.query(models.AnonymousUser).filter(models.AnonymousUser.aid == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            new_bookmark = models.ABookmark(forum_id=forum.forum_id, user_id=user.aid)
            db.add(new_bookmark)
            db.commit()
            db.refresh(new_bookmark)

            return new_bookmark
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
# Route to delete Bookmark
@app.delete("/coboard/{board}/{forum_name}")
async def delete_bookmark(board: str, forum_name: str, status: str, user_id: str, db: Session = Depends(get_db)):
    # Select the correct bookmark table based on status
    BookmarkModel = models.SBookmark if status == "se" else models.ABookmark
    forum = db.query(models.Forum).filter(models.Forum.slug == forum_name).first()
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")
    
    bookmark = db.query(BookmarkModel).filter_by(forum_id=forum.forum_id, user_id=user_id).first()
    
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")

    # Delete the bookmark
    db.delete(bookmark)
    db.commit()

    return {"message": "Bookmark deleted successfully"}

# Route to get user info
@app.get("/user/{id}", response_model=Union[schemas.SEUserResponse, schemas.AnonymousUserResponse])
async def get_user(id: str, db: Session = Depends(get_db)):
    try:
        se_user = db.query(models.SEUser).filter(
            models.SEUser.sid == id
        ).first()

        a_user = db.query(models.AnonymousUser).filter(
            models.AnonymousUser.aid == id
        ).first()
        
        if not se_user and not a_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if se_user: 
            response_data = se_user.__dict__.copy()
            if se_user.sprofile:
                response_data['sprofile'] = base64.b64encode(se_user.sprofile).decode('utf-8')

            # Fetch bookmarked forums and encode any binary icons
            bookmarked = (
                db.query(models.Forum)
                .join(models.SBookmark, models.Forum.forum_id == models.SBookmark.forum_id)
                .filter(models.SBookmark.user_id == se_user.sid)
                .all()
            )

            # Convert icons to Base64 if present
            bookmarked_data = [
                {
                    **bm.__dict__,
                    "icon": base64.b64encode(bm.icon).decode('utf-8') if bm.icon else None
                }
                for bm in bookmarked
            ]

            # Fetch created forums
            created = db.query(models.Forum).filter(models.Forum.creator_id == se_user.sid).all()
            created_data = [
                {
                    **c.__dict__,
                    "icon": base64.b64encode(c.icon).decode('utf-8') if c.icon else None
                }
                for c in created
            ]

            # Fetch files
            files = db.query(models.File).filter(models.File.s_owner == se_user.sid).all()
            files_data = [f.__dict__.copy() for f in files]

            # Add all data to response
            response_data['bookmarked'] = bookmarked_data
            response_data['created'] = created_data
            response_data['files'] = files_data
            return schemas.SEUserResponse(**response_data)
        
        else :
            response_data = a_user.__dict__.copy()
            if a_user.aprofile:
                response_data['aprofile'] = base64.b64encode(a_user.sprofile).decode('utf-8')

            # Fetch bookmarked forums and encode any binary icons
            bookmarked = (
                db.query(models.Forum)
                .join(models.ABookmark, models.Forum.forum_id == models.ABookmark.forum_id)
                .filter(models.ABookmark.user_id == a_user.aid)
                .all()
            )

            # Convert icons to Base64 if present
            bookmarked_data = [
                {
                    **bm.__dict__,
                    "icon": base64.b64encode(bm.icon).decode('utf-8') if bm.icon else None
                }
                for bm in bookmarked
            ]

            # Fetch files
            files = db.query(models.File).filter(models.File.a_owner == a_user.aid).all()
            files_data = [f.__dict__.copy() for f in files]

            # Add all data to response
            response_data['bookmarked'] = bookmarked_data
            response_data['files'] = files_data
            return schemas.AnonymousUserResponse(**response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Route to update user info
@app.put("/user/{id}", response_model=Union[schemas.SEUser, schemas.AnonymousUser])
async def update_user(id: str, new: schemas.UserUpdate, db: Session = Depends(get_db)):
    try:
        # Fetch the existing forum from the database
        se_user = db.query(models.SEUser).filter(
            models.SEUser.sid == id
        ).first()

        a_user = db.query(models.AnonymousUser).filter(
            models.AnonymousUser.aid == id
        ).first()
        
        if not se_user and not a_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if se_user:
            for key, value in new.dict(exclude_unset=True).items():
                if key == 'profileImage' and value:
                    try:
                        # Decode the Base64 icon and validate its size
                        decoded_profile = base64.b64decode(value)
                        if len(decoded_profile) > 1048576:  # Limit to 1 MB
                            raise HTTPException(status_code=400, detail="Icon file too large")
                        se_user.sprofile = decoded_profile
                    except base64.binascii.Error:
                        raise HTTPException(status_code=400, detail="Invalid base64 for icon")
                if key == 'username' and value:
                    se_user.username = value
                if key == 'password' and value:
                    se_user.spw = value

            db.commit()
            db.refresh(se_user)

            # Prepare response data
            response_data = se_user.__dict__.copy()
            if se_user.sprofile:
                response_data['sprofile'] = base64.b64encode(se_user.sprofile).decode('utf-8')

            return schemas.SEUser(**response_data)
        
        else :
            for key, value in new.dict(exclude_unset=True).items():
                print(f"Updating {key} with value: {value}")
                if key == 'profileImage' and value:
                    try:
                        # Decode the Base64 icon and validate its size
                        decoded_profile = base64.b64decode(value)
                        if len(decoded_profile) > 1048576:  # Limit to 1 MB
                            raise HTTPException(status_code=400, detail="Icon file too large")
                        a_user.aprofile = decoded_profile
                    except base64.binascii.Error:
                        raise HTTPException(status_code=400, detail="Invalid base64 for icon")
                if key == 'username' and value:
                    a_user.aid = value
                if key == 'password' and value:
                    a_user.apw = value

            db.commit()
            db.refresh(a_user)

            # Prepare response data
            response_data = a_user.__dict__.copy()
            if a_user.aprofile:
                response_data['aprofile'] = base64.b64encode(a_user.aprofile).decode('utf-8')

            return schemas.SEUser(**response_data)

    except SQLAlchemyError as e:
        db.rollback()
        error_msg = f"Database error while updating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        error_msg = f"Unexpected error while updating forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

# Route to delete access    
@app.delete("/coboard/{board}/{forum_name}/setting")
async def delete_access(board: str, forum_name: str, db: Session = Depends(get_db)):
    forum = db.query(models.Forum).filter(models.Forum.slug == forum_name).first()
    if not forum:
        raise HTTPException(status_code=404, detail="Forum not found")
    
    # Get all access records related to the forum
    access = db.query(models.Access).filter_by(forum_id=forum.forum_id).all()   
    if not access:
        return {"message": "No access records found for this forum"}
    
    # Delete each access record
    for access_record in access:
        db.delete(access_record)
    
    db.commit()

    forum.last_updated = date.today()
    db.commit()

    return {"message": "Access deleted successfully"}

# Route to create access
@app.post("/coboard/{board}/{forum_name}/setting", response_model=schemas.Access)
async def create_access(
    board: str, 
    forum_name: str, 
    user_id: str,
    db: Session = Depends(get_db)):
    try:
        forum = db.query(models.Forum).filter(models.Forum.slug == forum_name).first()
        if not forum:
            raise HTTPException(status_code=404, detail="Forum not found")
        user = db.query(models.SEUser).filter(models.SEUser.sid == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        new_access = models.Access(forum_id=forum.forum_id, user_id=user.sid)
        db.add(new_access)
        db.commit()
        db.refresh(new_access)

        forum.last_updated = date.today()
        db.commit()

        return new_access
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error occurred")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# Route to delete forum
@app.delete("/user/{sid}/{forum_id}")
async def delete_forum(
    sid: str,
    forum_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Find the forum in the database and ensure the user is the creator
        forum = db.query(models.Forum).filter(models.Forum.forum_id == forum_id).first()

        if not forum:
            raise HTTPException(status_code=404, detail="Forum not found")

        # Verify if the provided sid matches the forum creator's sid
        if forum.creator_id != sid:
            raise HTTPException(status_code=403, detail="You do not have permission to delete this forum")

        # Delete related dependencies: tags, topics, bookmarks, etc.
        db.query(models.ForumTag).filter(models.ForumTag.forum_id == forum_id).delete()
        db.query(models.ForumTopic).filter(models.ForumTopic.forum_id == forum_id).delete()
        db.query(models.SBookmark).filter(models.SBookmark.forum_id == forum_id).delete()
        db.query(models.ABookmark).filter(models.ABookmark.forum_id == forum_id).delete()
        db.query(models.Access).filter(models.Access.forum_id == forum_id).delete()

        # Delete the forum itself
        db.delete(forum)
        db.commit()

        return {"detail": "Forum deleted successfully"}

    except SQLAlchemyError as e:
        db.rollback()
        error_msg = f"Database error while deleting forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        error_msg = f"Unexpected error while deleting forum: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

# Route to create new anonymous user
@app.post("/signup", response_model=schemas.AnonymousUser)
async def create_anonymousUser(user: schemas.AnonymousUserCreate, db: Session = Depends(get_db)):
    try:     
        new_user = models.AnonymousUser(
            aid=user.aid,
            apw=user.apw,
            mail=user.mail
        )
        
        # Add the forum to the session and commit to get the forum_id
        db.add(new_user)
        db.commit()  # This will generate the forum_id
        db.refresh(new_user)  # Refresh to get the updated object
        
        return new_user
    
    except SQLAlchemyError as e:
        db.rollback()
        error_msg = f"Database error while creating user: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        error_msg = f"Unexpected error while creating user: {str(e)}"
        raise HTTPException(status_code=500, detail=error_msg)

# route to upload file
@app.post("/file")
async def upload_file(
    file: UploadFile = File(...),
    s_owner: str = Form(...),
    a_owner: str = Form(...),
    post_id: str = Form(...),
    db: Session = Depends(get_db)
):
    # Extract the file extension
    extension = os.path.splitext(file.filename)[1][1:]

    # Temporarily save the file with a basic name
    temp_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(temp_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create a new File record in the database
    new_file = models.File(
        filename=file.filename,
        path="",  # Temporary path, will update after renaming
        extension=extension,
        s_owner=s_owner if s_owner != 'null' else None,
        a_owner=a_owner if a_owner != 'null' else None,
        post_id=post_id
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    owner = s_owner if s_owner is not None else a_owner

    # Generate a unique filename: {file_id}_{owner}_{original_filename}
    unique_filename = f"{new_file.file_id}_{owner}_{file.filename}"
    final_location = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Rename the temporary file to the final location
    os.rename(temp_location, final_location)

    # Update the file path in the database
    new_file.path = final_location
    db.commit()
    db.refresh(new_file)

    return {"filename": unique_filename, "file_path": new_file.path}

# Route to download file
@app.get("/file/{file_id}")
async def get_file(file_id: int, db: Session = Depends(get_db)):
    # Retrieve file record
    file_record = db.query(models.File).filter(models.File.file_id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Check if file exists on disk
    if not os.path.exists(file_record.path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    # Use the original filename stored in the database
    original_filename = file_record.filename
    encoded_filename = urllib.parse.quote(original_filename)
    
    # Get MIME type based on extension
    mime_types = {
        # Documents
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        
        # Media
        'mp4': 'video/mp4',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        
        # Code
        'py': 'text/x-python',
        'txt': 'text/plain',
        'c': 'text/x-c',
        'cpp': 'text/x-c++src',
        'h': 'text/x-c',
        'js': 'text/javascript',
        'java': 'text/x-java-source',
        'html': 'text/html',
        'jsx': 'text/jsx',
        'css': 'text/css',
        'rs': 'text/rust',
        'go': 'text/x-go',
        'rb': 'text/x-ruby',
        'php': 'text/x-php',
        'sql': 'text/x-sql',
        'xml': 'text/xml',
        'json': 'application/json',
        'yaml': 'text/yaml',
        'md': 'text/markdown',
        
        # Archives
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'tar': 'application/x-tar',
        '7z': 'application/x-7z-compressed'
    }
    
    # Get MIME type based on file extension
    mime_type = mime_types.get(file_record.extension.lower(), 'application/octet-stream')
    
    headers = {
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Content-Type": f"{mime_type}; charset=utf-8",
        # Use RFC 5987 encoding for the filename
        "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
    }
    
    return FileResponse(
        path=file_record.path,
        filename=original_filename,
        media_type=mime_type,
        headers=headers
    )

# Helper function to run the Python script
def run_python_script(sender_email, sender_password, receiver_email, subject, message):
    try:
        # Define the command to run the Python script
        sender_email = "kiddoquest.se@gmail.com"
        sender_password = sender_password
        receiver_email = receiver_email
        subject = "Your Password Recovery"
        message = message

        command = f'python3 server/send_mail.py "{sender_email}" "{sender_password}" "{receiver_email}" "{subject}" "{message}"'
        result = subprocess.run(command, shell=True)

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail="Failed to execute Python script: " + str(e))

# API endpoint to send email
@app.post("/sendmail")
async def send_email(request: schemas.EmailRequest):
    sender_email = "kiddoquest.se@gmail.com"
    sender_password = "hrln ddln idjy hryv"  # Use a secure way to store credentials
    subject = "Your Password Recovery"
    message = f"Your current password: {request.pw}"

    # Call the Python script to send the email
    run_python_script(sender_email, sender_password, request.receiver_email, subject, message)

    return {"message": "Email sent successfully!"}