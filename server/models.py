from sqlalchemy import Column, Integer, String, LargeBinary, Date, ForeignKey, CheckConstraint, func
from sqlalchemy.orm import relationship
from .database import Base

# ABookmark model
class ABookmark(Base):
    __tablename__ = 'abookmark'
    
    forum_id = Column(Integer, ForeignKey('forum.forum_id'), primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey('anonymous_user.aid'), primary_key=True, index=True)

# Access model
class Access(Base):
    __tablename__ = 'access'
    
    forum_id = Column(Integer, ForeignKey('forum.forum_id'), primary_key=True, index=True)
    user_id = Column(String(10), ForeignKey('se_user.sid'), primary_key=True, index=True)

# AnonymousUser model
class AnonymousUser(Base):
    __tablename__ = 'anonymous_user'
    
    aid = Column(String(10), primary_key=True, index=True)
    apw = Column(String(255), nullable=False)
    aprofile = Column(LargeBinary)
    mail = Column(String(255), nullable=False)

# Comment model
class Comment(Base):
    __tablename__ = 'comment'
    
    comment_id = Column(Integer, primary_key=True, index=True)
    comment_text = Column(String(255), nullable=False)
    comment_heart = Column(Integer, nullable=False, default=0)
    scomment_creator = Column(String(10), ForeignKey('se_user.sid'), nullable=True)
    acomment_creator = Column(String(10), ForeignKey('anonymous_user.aid'), nullable=True)

    __table_args__ = (
        CheckConstraint(
            '(scomment_creator IS NOT NULL AND acomment_creator IS NULL) OR (scomment_creator IS NULL AND acomment_creator IS NOT NULL)',
            name='chk_creator_only_one'
        ),
    )

    posts = relationship("Post", secondary="post_comment", back_populates="comments")

# Forum model
class Forum(Base):
    __tablename__ = 'forum'
    
    forum_id = Column(Integer, primary_key=True, index=True)
    forum_name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(255))
    creator_id = Column(String(10), ForeignKey('se_user.sid'), nullable=False)
    created_time = Column(Date, nullable=False, default=func.current_date())
    icon = Column(LargeBinary)
    wallpaper = Column(String(7), default="#006b62")
    font = Column(Integer, default=0)
    sort_by = Column(Integer, default=0)
    slug = Column(String(255), nullable=False, unique=True)
    board = Column(String(255), nullable=False)
    last_updated = Column(Date, nullable=False, default=func.current_date())

    # Updated topics relationship
    topics = relationship("Topic", secondary="forum_topic", back_populates="forums")
    tags = relationship("Tag", secondary="forum_tag", back_populates="forums")

# ForumTag model
class ForumTag(Base):
    __tablename__ = 'forum_tag'
    
    forum_id = Column(Integer, ForeignKey('forum.forum_id'), primary_key=True, index=True)
    tag_id = Column(Integer, ForeignKey('tag.tag_id'), primary_key=True, index=True)

    forum = relationship("Forum")
    tag = relationship("Tag")

# ForumTopic model
class ForumTopic(Base):
    __tablename__ = 'forum_topic'
    
    forum_id = Column(Integer, ForeignKey('forum.forum_id'), primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey('topic.topic_id'), primary_key=True, index=True)

    forum = relationship("Forum")
    topic = relationship("Topic")

# Post model
class Post(Base):
    __tablename__ = 'post'
    
    post_id = Column(Integer, primary_key=True, index=True)
    post_head = Column(String(255), nullable=False)
    post_body = Column(String(255))
    heart = Column(Integer, default=0)
    spost_creator = Column(String(10), ForeignKey('se_user.sid'), nullable=True)
    apost_creator = Column(String(10), ForeignKey('anonymous_user.aid'), nullable=True)
    pic = Column(LargeBinary)

    __table_args__ = (
        CheckConstraint(
            '(spost_creator IS NOT NULL AND apost_creator IS NULL) OR (spsot_creator IS NULL AND apost_creator IS NOT NULL)',
            name='chk_creator_only_one'
        ),
    )

    topics = relationship("Topic", secondary="topic_post", back_populates="posts")
    comments = relationship("Comment", secondary="post_comment", back_populates="posts")

# PostComment model
class PostComment(Base):
    __tablename__ = 'post_comment'
    
    post_id = Column(Integer, ForeignKey('post.post_id'), primary_key=True, index=True)
    comment_id = Column(Integer, ForeignKey('comment.comment_id'), primary_key=True, index=True)

    post = relationship("Post")
    comment = relationship("Comment")

# SBookmark model
class SBookmark(Base):
    __tablename__ = 'sbookmark'
    
    forum_id = Column(Integer, ForeignKey('forum.forum_id'), primary_key=True, index=True)
    user_id = Column(String(255), ForeignKey('se_user.sid'), primary_key=True, index=True)

# SEUser model
class SEUser(Base):
    __tablename__ = 'se_user'
    
    sid = Column(String(10), primary_key=True, index=True)
    spw = Column(String(255), nullable=False)
    sprofile = Column(LargeBinary)
    sfile = Column(String(255))
    username = Column(String(255))

# Tag model
class Tag(Base):
    __tablename__ = 'tag'
    
    tag_id = Column(Integer, primary_key=True, index=True)
    tag_text = Column(String(255), nullable=False)
    board = Column(String(255), nullable=False)
    use = Column(Integer, nullable=False, default=0)

    forums = relationship("Forum", secondary="forum_tag", back_populates="tags")

# Topic model
class Topic(Base):
    __tablename__ = 'topic'
    
    topic_id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    publish = Column(Date)
    expired = Column(Date)

    # Correct relationship
    forums = relationship("Forum", secondary="forum_topic", back_populates="topics")
    posts = relationship("Post", secondary="topic_post", back_populates="topics")

# TopicPost model
class TopicPost(Base):
    __tablename__ = 'topic_post'
    
    topic_id = Column(Integer, ForeignKey('topic.topic_id'), primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('post.post_id'), primary_key=True, index=True)

    topic = relationship("Topic")
    post = relationship("Post")

# File model
class File(Base):
    __tablename__ = 'file'
    file_id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    path = Column(String)
    extension = Column(String)
    s_owner = Column(String, ForeignKey('se_user.sid'))
    a_owner = Column(String, ForeignKey('anonymous_user.aid'))
    post_id = Column(Integer, ForeignKey('post.post_id'))
