import React, { useContext } from "react";
import { deleteBookmark } from "../../../api";
import { UserContext } from "../../../UserContext";
import BookmarkView from "./BookmarkView";

const BookmarkEdit = ({
  isDropdownVisible,
  userData,
  loading,
  error,
  sortBy,
  forums,
  filteredForums,
  searchForumTerm,
  toggleDropdown,
  handleSortSelection,
  navigate,
  setForums,
  setFilteredForums,
  onEditClick,
}) => {
  const { user, status } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  
  const slugify = (forumName) => {
    return forumName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[[]/g, "-")
      .replace(/[\]]/g, "-")
      .replace(/=/g, "-")
      .replace(/;/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .trim();
  };

  const joinForum = (forumName, board) => {
    const slugifiedForumName = slugify(forumName);
    navigate(`/coboard/${board}/${slugifiedForumName}`);
  };

  const handleDeleteForum = async (forum_name, board) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this bookmark?"
    );
    if (confirmDelete) {
      try {
        await deleteBookmark(board, forum_name, id, status);
        setForums((prevForums) =>
          prevForums.filter((forum) => forum.forum_name !== forum_name)
        );
        setFilteredForums((prevFilteredForums) =>
          prevFilteredForums.filter((forum) => forum.forum_name !== forum_name)
        );
        alert("Forum deleted successfully.");
      } catch (error) {
        console.error("Failed to delete forum:", error);
        alert("An error occurred while deleting the forum.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-4 md:px-10 pb-12">
      <div className="flex flex-col md:flex-row items-center mt-12 gap-4">
        <div className="text-black text-2xl md:text-4xl font-bold whitespace-nowrap">
          Remove bookmark
        </div>
        <div className="bg-gray-400 h-[3px] w-full md:w-[840px] flex-shrink-0 mt-2 md:mt-0" />
      </div>

      <div className="mt-6 md:mt-0 flex flex-col md:flex-row md:mr-10 md:justify-end gap-4">
        <button
          className="bg-lightergreen text-basegreen py-2 px-8 md:px-14 rounded-xl hover:bg-lightergreenhover"
          onClick={onEditClick}
        >
          Update
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-auto mt-6">
        {filteredForums.map((forum, index) =>
          forum ? (
            <div
              key={forum.forum_id || index}
              className="flex flex-col w-full h-full justify-center items-center group relative"
            >
              <div
                className="w-full h-40 md:w-80 md:h-56 justify-center items-center rounded-3xl overflow-hidden cursor-pointer relative"
                style={{ backgroundColor: forum.wallpaper || "basegreen" }}
                onClick={() => handleDeleteForum(forum.slug, forum.board)}
              >
                {forum.icon && (
                  <img
                    src={`data:image/jpeg;base64,${forum.icon}`}
                    alt={`${forum.forum_name || "Forum"} icon`}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl md:text-6xl font-bold">X</span>
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-bold mt-2 self-start ml-4 z-10">
                {forum.forum_name || "Unnamed Forum"}
              </h3>
            </div>
          ) : (
            <div key={index} className="text-red-500">
              Invalid forum data
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookmarkEdit;
