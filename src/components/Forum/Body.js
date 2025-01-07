import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CreateTopic from "./CreateTopic";
import AddPost from "./AddPost";
import { fetchTopics, updateLike, addComment, downloadFile } from "../../api";
import { UserContext } from "../../UserContext";

const Body = ({ board, forum_name, searchTopicTerm = "" }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isCreateTopicVisible, setCreateTopicVisible] = useState(false);
  const [isAddPostVisible, setAddPostVisible] = useState(false);
  const [forumData, setForumData] = useState(null);
  const [topic_id, setTopicID] = useState(null);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [newComments, setNewComments] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [font, setFont] = useState(0);
  const navigate = useNavigate();
  const [creator_id, setCreatorID] = useState("12345678");
  const [default_sort, setDefaultSort] = useState(0);
  const { user, status } = useContext(UserContext);
  const [hovered, setHovered] = useState(false);


  const id = status === "se" ? user.sid : user.aid;

  useEffect(() => {
    const loadTopics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchTopics(board, forum_name);

        if (!response || typeof response !== "object") {
          throw new Error("Invalid response from server");
        }

        setForumData(response);
        let topics = response.topics || [];

        // Apply default sorting based on default_sort
        if (default_sort === 0) {
          topics = topics.sort((a, b) => b.topic_id - a.topic_id); // Latest by ID
        } else if (default_sort === 1) {
          topics = topics.sort((a, b) => (b.heart || 0) - (a.heart || 0)); // Most likes
        } else if (default_sort === 2) {
          topics = topics.sort(
            (a, b) => (b.posts?.length || 0) - (a.posts?.length || 0)
          ); // Most comments
        }

        setFilteredTopics(topics);
        setCreatorID(response.creator_id);
        setFont(response.font);
        setDefaultSort(response.sort_by);
        setSortOption(default_sort.toString());
      } catch (error) {
        setError("Failed to load topics. " + (error.message || ""));
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, [board, forum_name, default_sort]);

  useEffect(() => {
    if (forumData && forumData.topics) {
      let filtered = forumData.topics.filter((topic) =>
        topic.text.toLowerCase().includes(searchTopicTerm.toLowerCase())
      );

      // Sort based on the selected option
      if (sortOption === "latest") {
        filtered.sort((a, b) => b.topic_id - a.topic_id);
      } else if (sortOption === "popular") {
        filtered.sort(
          (a, b) => (b.posts?.length || 0) - (a.posts?.length || 0)
        );
      } else if (sortOption === "likes") {
        filtered.sort((a, b) => (b.heart || 0) - (a.heart || 0));
      }

      setFilteredTopics(filtered);
    }
  }, [searchTopicTerm, forumData, sortOption]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const openCreateTopic = () => {
    setCreateTopicVisible(true);
  };

  const closeCreateTopic = () => {
    setCreateTopicVisible(false);
  };

  const handleCreateTopic = (newTopic) => {
    setForumData((prevData) => ({
      ...prevData,
      topics: [...(prevData.topics || []), newTopic],
    }));
  };

  const openAddPost = (topic_id) => {
    setAddPostVisible(true);
    setTopicID(topic_id);
  };

  const closeAddPost = () => {
    setAddPostVisible(false);
  };

  const handleCreatePost = (newPost) => {
    setForumData((prevData) => {
      const updatedTopics = prevData.topics.map((topic) => {
        if (topic.topic_id === topic_id) {
          return {
            ...topic,
            posts: [...(topic.posts || []), newPost],
          };
        }
        return topic;
      });
      return { ...prevData, topics: updatedTopics };
    });
  };

  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    if (!newComments[postId]) {
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId) => {
    if (newComments[postId].trim()) {
      try {
        const s = status === "se" ? user.sid : null;
        const a = status === "a" ? user.aid : null;
        const newComment = await addComment(
          board,
          forum_name,
          postId,
          newComments[postId],
          s,
          a
        );
        setForumData((prevData) => {
          const updatedTopics = prevData.topics.map((topic) => ({
            ...topic,
            posts: topic.posts.map((post) =>
              post.post_id === postId
                ? { ...post, comments: [...post.comments, newComment] }
                : post
            ),
          }));
          return { ...prevData, topics: updatedTopics };
        });
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
      } catch (error) {
        console.error("Failed to add comment", error);
      }
    }
  };

  const updateLiked = async (itemId, itemType) => {
    try {
      const updatedItem = await updateLike(board, forum_name, itemId, itemType);
      setForumData((prevData) => {
        const updatedTopics = prevData.topics.map((topic) => ({
          ...topic,
          posts: topic.posts.map((post) => {
            if (itemType === "post" && post.post_id === itemId) {
              return { ...post, heart: updatedItem.likes };
            }
            return {
              ...post,
              comments: post.comments.map((comment) =>
                itemType === "comment" && comment.comment_id === itemId
                  ? { ...comment, comment_heart: updatedItem.likes }
                  : comment
              ),
            };
          }),
        }));
        return { ...prevData, topics: updatedTopics };
      });
    } catch (error) {
      console.error("Failed to update like", error);
    }
  };
  
  return (
    <div className="w-full h-screen relative overflow-auto pl-8 pr-20 pb-12 flex flex-col bg-graybg"
      onDoubleClick={() => setCreateTopicVisible(true)}
      >
      <button
        id="sortbyForumButton"
        onClick={toggleDropdown}
        className="w-12 h-12 fixed right-[50px] mt-4 mr-24 z-10"
      >
        <img src="/asset/sort.svg" alt="Sort" />
      </button>
      <div
  className={`fixed right-[130px] mt-14 mr-4 border border-gray-300 rounded-md z-10 bg-white shadow-lg transform transition-all duration-200 ${
    isDropdownVisible
      ? "translate-y-0 opacity-100 visible"
      : "translate-y-[-5px] opacity-0 invisible"
  }`}
>
  <ul className="p-2">
    <li className="flex items-center whitespace-nowrap py-1">
      <input
        type="radio"
        name="sortOption"
        className="mr-2"
        checked={sortOption === "latest"}
        onChange={() => handleSortChange("latest")}
      />
      <span>Latest</span>
    </li>
    <li className="flex items-center whitespace-nowrap py-1">
      <input
        type="radio"
        name="sortOption"
        className="mr-2"
        checked={sortOption === "popular"}
        onChange={() => handleSortChange("popular")}
      />
      <span>Most Popular</span>
    </li>
  </ul>
</div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div
          className={`w-full h-screen relative overflow-auto ${
            font === 0
              ? "istok-web-regular"
              : font === 1
              ? "tinos-regular"
              : "playpen-sans-regular"
          }`}
        >
          <div className="flex flex-row my-10">
            {filteredTopics
              .filter((topic) => {
                const now = new Date();
                const publishDate = topic.publish
                  ? new Date(topic.publish)
                  : null;

                // Normalize dates to ignore time
                const nowDateOnly = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                );
                const publishDateOnly = publishDate
                  ? new Date(
                      publishDate.getFullYear(),
                      publishDate.getMonth(),
                      publishDate.getDate()
                    )
                  : null;

                // Exclude if publish date is in the future
                return !publishDateOnly || publishDateOnly <= nowDateOnly;
              })
              .map((topic) => {
                const now = new Date();
                const expiredDate = topic.expired
                  ? new Date(topic.expired)
                  : null;

                // Normalize dates to ignore time
                const nowDateOnly = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate()
                );
                const expiredDateOnly = expiredDate
                  ? new Date(
                      expiredDate.getFullYear(),
                      expiredDate.getMonth(),
                      expiredDate.getDate()
                    )
                  : null;

                const isTopicExpired =
                  expiredDateOnly && expiredDateOnly <= nowDateOnly;

                return (
                  <div
                    key={topic.topic_id}
                    className="topic-section flex flex-col"
                  >
                    <div className="topic-card w-72 h-24 bg-white rounded-2xl m-6 p-6 relative flex items-center justify-between">
                      <h2 className="text-xl font-bold self-start h-full flex items-center justify-start">
                        {topic.text}
                      </h2>
                      <div className=" w-9 h-9 absolute top-0 right-0 m-4 flex items-center justify-center">
                        <button
                          onClick={() =>
                            !isTopicExpired && openAddPost(topic.topic_id)
                          }
                          className={`flex justify-center items-center ${
                            isTopicExpired
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={isTopicExpired}
                        >
                          <img
                            src="/asset/add_post.svg"
                            alt="Add Post"
                            className="w-8 h-8 md:w-12 md:h-12"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="post-section ml-6 mt-3">
                      {topic.posts && topic.posts.length > 0 ? (
                        topic.posts.map((post) => (
                          <div key={post.post_id} className="mb-4">
                            <div className="post-card flex flex-col p-3 border rounded-lg bg-gray-100 shadow w-72 h-fit mt-2 cursor-pointer">
                              <h4 className="font-semibold">
                                {post.post_head}
                              </h4>
                              <p className="text-sm">{post.post_body}</p>
                              <p className="text-gray-500 text-xs">
                                By: {post.spost_creator || post.apost_creator}
                              </p>
                              {post.pic && (
                                <img
                                  src={`data:image/jpeg;base64,${post.pic}`}
                                  alt="Post image"
                                  className="w-full h-auto mt-2 rounded-md object-cover"
                                />
                              )}
                              {post.files && post.files.length > 0 && (
                                <div className="files-section mt-2">
                                  <ul>
                                    {post.files.map((file) => (
                                      <li
                                        key={file.file_id}
                                        className="file-item mt-2"
                                      >
                                        <button
                                          onClick={() =>
                                            downloadFile(file.file_id)
                                          }
                                          className="text-blue-500 hover:underline"
                                        >
                                          {file.filename}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex">
                                <p className="flex-col m-1">{post.heart}</p>
                                <button
                                  className={`flex-col w-5 h-5 m-1 mt-2 ${
                                    isTopicExpired
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    !isTopicExpired &&
                                    updateLiked(post.post_id, "post")
                                  }
                                  disabled={isTopicExpired}
                                >
                                  <img
                                    src="/asset/heart_icon.svg"
                                    className="w-full h-full"
                                    alt="Like post"
                                  />
                                </button>
                                <p className="flex-col m-1">
                                  {post.comments.length}
                                </p>
                                <button
                                  className={`flex-col w-5 h-5 m-1 mt-2 ${
                                    isTopicExpired
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    !isTopicExpired &&
                                    toggleComments(post.post_id)
                                  }
                                  disabled={isTopicExpired}
                                >
                                  <img
                                    src="/asset/comment_icon.svg"
                                    className="w-full h-full"
                                    alt="Comment post"
                                  />
                                </button>
                              </div>
                            </div>
                            {expandedPosts[post.post_id] && !isTopicExpired && (
                              <div className="comments-section ml-4 mt-2">
                                {post.comments.map((comment, index) => (
                                  <div
                                    key={index}
                                    className="comment-card flex flex-col p-3 border rounded-lg bg-white shadow w-64 h-fit mt-2"
                                  >
                                    <p className="text-sm">
                                      {comment.comment_text}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                      By:{" "}
                                      {comment.scomment_creator ||
                                        comment.acomment_creator}
                                    </p>
                                    <div className="flex">
                                      <p className="flex-col m-1">
                                        {comment.comment_heart}
                                      </p>
                                      <button
                                        className="flex-col w-5 h-5 m-1 mt-2"
                                        onClick={() =>
                                          !isTopicExpired &&
                                          updateLiked(
                                            comment.comment_id,
                                            "comment"
                                          )
                                        }
                                        disabled={isTopicExpired}
                                      >
                                        <img
                                          src="/asset/heart_icon.svg"
                                          className="w-full h-full"
                                          alt="Like comment"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="new-comment-input mt-2">
                                  <input
                                    type="text"
                                    value={newComments[post.post_id] || ""}
                                    onChange={(e) =>
                                      handleCommentChange(
                                        post.post_id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Add a comment..."
                                    className="w-full p-2 border rounded"
                                    disabled={isTopicExpired}
                                  />
                                  <button
                                    onClick={() =>
                                      !isTopicExpired &&
                                      submitComment(post.post_id)
                                    }
                                    className={`mt-2 bg-basegreen text-white p-2 rounded ${
                                      isTopicExpired
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    disabled={isTopicExpired}
                                  >
                                    Submit Comment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="ml-12">No posts yet for this topic.</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {creator_id === id && (
        <div className="fixed bottom-0 right-0 z-10">
          <button
            type="button"
            onClick={openCreateTopic}
            className="p-10 mr-20 w-44 h-44 relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <img
              src="/asset/addTopic_button.svg"
              alt="Add Topic"
              onMouseEnter={(e) =>
                (e.currentTarget.src = "/asset/addTopic_button1.svg")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.src = "/asset/addTopic_button.svg")
              }
            />
            {hovered && (
              <div className="bg-white shadow-lg rounded-md p-4 absolute left-[-160px] md:left-[-365px] top-[50px] md:top-[60px] w-[200px] md:w-[400px]">
                <p className="text-gray-700 text-left text-sm md:text-base">
                  Double click anywhere or click here to add a topic
                </p>
              </div>
            )}
          </button>
        </div>
      )}
      <CreateTopic
        isVisible={isCreateTopicVisible}
        closeCreateTopic={closeCreateTopic}
        onCreateTopic={handleCreateTopic}
        board={board}
        forum_name={forum_name}
      />
      <AddPost
        isVisible={isAddPostVisible}
        closeAddPost={closeAddPost}
        onPostCreated={handleCreatePost}
        topic_id={topic_id}
        board={board}
        forum_name={forum_name}
      />
    </div>
  );
};

export default Body;
