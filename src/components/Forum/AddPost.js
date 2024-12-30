import React, { useState, useContext, useRef } from "react";
import { createPost, uploadFile } from "../../api";
import { UserContext } from "../../UserContext";

const AddPost = ({
  isVisible,
  closeAddPost,
  onPostCreated,
  topic_id,
  board,
  forum_name,
}) => {
  const [postText, setPostText] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const { user, status } = useContext(UserContext);

  const picInputRef = useRef();
  const fileInputRef = useRef();

  const handlePublish = async () => {
    if (postText.trim() === "") {
      alert("Title cannot be empty!");
      return;
    }

    const postData = {
      post_head: postText,
      post_body: postDetail,
      heart: 0,
      spost_creator: status === "se" ? user.sid : null,
      apost_creator: status === "a" ? user.aid : null,
      pic: selectedImage,
    };

    try {
      const createdPost = await createPost(
        board,
        forum_name,
        topic_id,
        postData
      );
      console.log("Created post:", createdPost);

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const sid = status === "se" ? user.sid : null;
          const aid = status === "a" ? user.aid : null;
          const fileData = new FormData();
          fileData.append("file", file);
          fileData.append("s_owner", sid);
          fileData.append("a_owner", aid);
          fileData.append("post_id", createdPost.post_id);
          await uploadFile(fileData);
        }
      }

      setPostText("");
      setPostDetail("");
      setSelectedImage(null);
      setPreview(null);
      setSelectedFiles([]);
      onPostCreated(createdPost);
      closeAddPost();
      if (selectedFiles.length > 0) {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
      alert("Error creating post. Please try again.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setSelectedImage(base64String);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleButtonClick = (ref) => {
    if (ref.current) ref.current.click();
  };

  const handleClose = () => {
    setPostText("");
    setPostDetail("");
    setSelectedImage(null);
    setSelectedFiles([]);
    setPreview(null);
    closeAddPost();
  };
  
  return (
    <>
      {isVisible && (
        <div
          id="addpost"
          className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white w-400 p-6 rounded-2xl shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 text-gray-600 text-xl font-bold"
              >
                <img
                  src="/asset/x.svg"
                  alt="Close"
                  className="w-full h-full object-contain"
                  onMouseEnter={(e) =>
                    (e.currentTarget.src = "/asset/x_hover.svg")
                  }
                  onMouseLeave={(e) => (e.currentTarget.src = "/asset/x.svg")}
                />
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePublish}
                  className="w-28 h-10 rounded-md bg-basegreen hover:bg-basegreenhover text-white text-lg font-semibold"
                >
                  Post
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full p-2 mb-4 rounded-md text-gray1 font-semibold text-2xl cursor-pointer"
            />
            <textarea
              placeholder="What are you thinking?"
              value={postDetail}
              onChange={(e) => setPostDetail(e.target.value)}
              className="w-full h-48 p-3 mb-4 rounded-md text-left text-gray1 font-semibold text-lg border-2 resize-none overflow-hidden cursor-pointer"
              style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            />

            {preview && (
              <div className="w-full h-56 flex items-center justify-center mb-4 border-4 border-gray1 rounded-xl">
                <img
                  src={preview}
                  alt="Image Preview"
                  className="w-full h-full object-cover p-2"
                />
              </div>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Attached Files:</h4>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex space-x-4 mt-4 pl-2">
              <button
                onClick={() => handleButtonClick(picInputRef)}
                disabled={Boolean(selectedImage)}
                className="w-9 h-9 flex items-center justify-center rounded-md"
              >
                <img
                  src={
                    selectedImage
                      ? "/asset/addPic_disabled.svg"
                      : "/asset/addPic_enabled.svg"
                  }
                  alt="Add Picture"
                  className="w-full h-full object-contain"
                  onMouseEnter={(e) => {
                    if (!selectedImage) {
                      e.currentTarget.src = "/asset/addPic_hover.svg";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedImage) {
                      e.currentTarget.src = "/asset/addPic_enabled.svg";
                    }
                  }}
                />
              </button>
              <button
                onClick={() => handleButtonClick(fileInputRef)}
                className="w-10 h-10 flex items-center justify-center rounded-md"
              >
                <img
                  src="/asset/addFile.svg"
                  alt="Add File"
                  className="w-full h-full object-contain"
                  onMouseEnter={(e) =>
                    (e.currentTarget.src = "/asset/addFile_hover.svg")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.src = "/asset/addFile.svg")
                  }
                />
              </button>
            </div>

            <input
              ref={picInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddPost;
