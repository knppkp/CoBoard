from datetime import date
from pydantic import BaseModel, Field
from typing import Optional, List

# Tag Pydantic models
class TagBase(BaseModel):
    tag_text: str
    board: str
    use: int = 0

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    tag_id: int

    class Config:
        from_attributes = True

# ABookmark Pydantic models
class ABookmarkBase(BaseModel):
    forum_id: int
    user_id: str

class ABookmarkCreate(ABookmarkBase):
    pass

class ABookmark(ABookmarkBase):
    class Config:
        from_attributes = True

# Access Pydantic models
class AccessBase(BaseModel):
    forum_id: int
    user_id: str

class AccessCreate(AccessBase):
    pass

class Access(AccessBase):
    class Config:
        from_attributes = True

# AnonymousUser Pydantic models
class AnonymousUserBase(BaseModel):
    aid: str
    apw: str
    aprofile: Optional[str] = Field(None, description="Base64 encoded icon")
    mail: str

class AnonymousUserCreate(AnonymousUserBase):
    pass

class AnonymousUser(AnonymousUserBase):
    class Config:
        from_attributes = True

# Comment Pydantic models
class CommentBase(BaseModel):
    comment_text: str
    comment_heart: Optional[int] = 0
    scomment_creator: Optional[str]
    acomment_creator: Optional[str]

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    comment_id: int

    class Config:
        from_attributes = True

# File Pydantic models
class FileBase(BaseModel):
    file_id: int
    filename: str
    path: str
    extension : str
    s_owner: Optional[str] = None
    a_owner: Optional[str] = None
    post_id: Optional[int]

class FileCreate(FileBase):
    pass

class File(FileBase):
    file_id: int

    class Config:
        from_attributes = True

# Forum Pydantic models
class ForumBase(BaseModel):
    forum_name: str
    description: Optional[str] = None
    creator_id: str
    created_time: Optional[date] = Field(default_factory=date.today)
    icon: Optional[str] = Field(None, description="Base64 encoded icon")
    wallpaper: Optional[str] = "#006b62"
    font: Optional[int] = 0
    sort_by: Optional[int] = 0
    slug: Optional[str] = None  # Make slug optional
    board: str
    last_updated: Optional[date] = Field(default_factory=date.today)

class ForumCreate(ForumBase):
    tags: Optional[List[Tag]] = []

class Forum(ForumBase):
    forum_id: int

    class Config:
        from_attributes = True

# ForumTag Pydantic models
class ForumTagBase(BaseModel):
    forum_id: int
    tag_id: int

class ForumTagCreate(ForumTagBase):
    pass

class ForumTag(ForumTagBase):
    class Config:
        from_attributes = True

# ForumTopic Pydantic models
class ForumTopicBase(BaseModel):
    forum_id: int
    topic_id: int

class ForumTopicCreate(ForumTopicBase):
    pass

class ForumTopic(ForumTopicBase):
    class Config:
        from_attributes = True

# Post Pydantic models
class PostBase(BaseModel):
    post_head: str
    post_body: Optional[str] = None
    heart: Optional[int] = 0
    spost_creator: Optional[str]
    apost_creator: Optional[str]
    pic: Optional[str] = Field(None, description="Base64 encoded icon")
    comments: List[Comment] = []
    files: List[File] = []

class PostCreate(PostBase):
    pass

class Post(PostBase):
    post_id: int

    class Config:
        from_attributes = True

# PostComment Pydantic models
class PostCommentBase(BaseModel):
    post_id: int
    comment_id: int

class PostCommentCreate(PostCommentBase):
    pass

class PostComment(PostCommentBase):
    class Config:
        from_attributes = True

# SBookmark Pydantic models
class SBookmarkBase(BaseModel):
    forum_id: int
    user_id: str

class SBookmarkCreate(SBookmarkBase):
    pass

class SBookmark(SBookmarkBase):
    class Config:
        from_attributes = True

# SEUser Pydantic models
class SEUserBase(BaseModel):
    sid: str
    spw: str
    sprofile: Optional[str] = Field(None, description="Base64 encoded icon")
    sfile: Optional[str] = None
    username: Optional[str]

class SEUserCreate(SEUserBase):
    pass

class SEUser(SEUserBase):
    class Config:
        from_attributes = True

# Topic Pydantic models
class TopicBase(BaseModel):
    text: str
    publish: Optional[date] = Field(None, description="No schedule")
    expired: Optional[date] = Field(None, description="No expired")
    posts: List[Post] = []

class TopicCreate(TopicBase):
    pass

class Topic(TopicBase):
    topic_id: int

    class Config:
        from_attributes = True

# TopicPost Pydantic models
class TopicPostBase(BaseModel):
    topic_id: int
    post_id: int

class TopicPostCreate(TopicPostBase):
    pass

class TopicPost(TopicPostBase):
    class Config:
        from_attributes = True

###
class ForumResponse(Forum):
    creator: Optional[str]
    topics: List[Topic]
    tags: List[Tag]
    btags: List[Tag]
    sbookmarks: Optional[List[SBookmark]]
    abookmarks: Optional[List[ABookmark]]
    access: Optional[List[Access]]

    class Config:
        from_attributes = True

class ForumWithContributors(Forum):
    total_contributors: int

class BoardResponse(BaseModel):
    forums: List[ForumWithContributors]
    tags: List[Tag]
    forumtag: Optional[List[ForumTag]]
    access: Optional[List[Access]]

    class Config:
        from_attributes = True

class LikeUpdate(BaseModel):
    item_id: int
    item_type: str  # 'post' or 'comment'

class LikeResponse(BaseModel):
    item_id: int
    item_type: str
    likes: int

class UserResponse(BaseModel):
    se: List[SEUser]
    anonymous: List[AnonymousUser]

    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    user_id: str
    status: str

class SEUserResponse(SEUserBase):
    bookmarked: Optional[List[Forum]]
    created: Optional[List[Forum]]
    files: Optional[List[File]]

class AnonymousUserResponse(AnonymousUserBase):
    bookmarked: Optional[List[Forum]]
    files: Optional[List[File]]

class EmailRequest(BaseModel):
    receiver_email: str
    pw: str

class UserUpdate(BaseModel):
    studentId: str
    username: str
    password: str
    profileImage: str