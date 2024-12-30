import React, { useContext } from "react";
import { UserContext } from "../../../UserContext";
import { deleteForum } from "../../../api";

const YourBoardEdit = ({
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
  const { user } = useContext(UserContext);
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

  const handleDeleteForum = async (forumId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this forum?\nYour forum will be permanently deleted and cannot be recovered."
    );
    if (confirmDelete) {
      try {
        await deleteForum(forumId, user.sid);
        setForums((prevForums) =>
          prevForums.filter((forum) => forum.forum_id !== forumId)
        );
        setFilteredForums((prevFilteredForums) =>
          prevFilteredForums.filter((forum) => forum.forum_id !== forumId)
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
    <div>
      <div className="mt-6 ml-1 md:ml-4 pr-5 md:pr-0 pb-44">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center mt-12 ml-4 md:ml-10 gap-4 md:gap-6">
          <div className="text-black text-2xl md:text-4xl font-bold whitespace-nowrap">
            Delete your board
          </div>
          <div className="bg-gray-400 h-[3px] w-full md:w-[824px] flex-shrink-0" />
        </div>

        {/* Edit Button */}
        <div className="flex flex-col md:flex-row justify-center ml-4 md:ml-[950px] mt-4 md:mt-0">
          <button

            className="bg-lightergreen text-basegreen py-2 px-8 md:px-14 rounded-xl hover:bg-lightergreenhover"
            onClick={onEditClick}
          >
            Update
          </button>
        </div>

        {/* Forum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-auto mt-6 ml-4">
          {filteredForums.map((forum, index) =>
            forum ? (
              <div
                key={forum.forum_id || index}
                className="flex flex-col w-full h-full justify-center items-center group relative"
              >
                <div
                  className="w-full md:w-80 h-56 justify-center items-center rounded-3xl overflow-hidden cursor-pointer relative"
                  style={{ backgroundColor: forum.wallpaper || "basegreen" }}
                  onClick={() => handleDeleteForum(forum.forum_id)}
                >
                  {forum.icon && (
                    <img
                      src={`data:image/jpeg;base64,${forum.icon}`}
                      alt={`${forum.forum_name || "Forum"} icon`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-4xl md:text-6xl font-bold">
                      X
                    </span>
                  </div>
                </div>
                <h3 className="text-lg md:text-2xl font-bold mt-2 self-start ml-4 md:ml-14 z-10">
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
    </div>
  );
};

export default YourBoardEdit;
