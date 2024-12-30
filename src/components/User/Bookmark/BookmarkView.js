import React, { useState } from "react";

const BookmarkView = ({
  userData,
  loading,
  error,
  sortBy,
  forums,
  filteredForums,
  searchForumTerm,
  navigate,
  onEditClick,
  handleSortSelection,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="mt-6 ml-1 md:ml-4 pr-5 md:pr-0 pb-44">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center mt-12 gap-4 md:ml-10">
          <div className="text-black text-2xl md:text-4xl font-bold whitespace-nowrap">
            Your Bookmarks
          </div>
          <div className="bg-gray-400 h-[3px] ml-4 md:ml-0 w-full md:w-[870px] flex-shrink-0" />
        </div>

        {/* Edit and Sort Buttons */}
        <div className="flex flex-col md:flex-row md:ml-[1000px] ml-4 mt-4 md:mt-0 gap-2 md:gap-5">
          <button
            className="bg-lightergreen text-basegreen py-2 px-6 md:px-10 rounded-xl hover:bg-lightergreenhover"
            onClick={onEditClick}
          >
            Edit
          </button>
          <div
            className="relative mr-16 md:mr-4"
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <button
              id="sortbyButton"
              onClick={toggleDropdown}
              className="w-8 h-8 ml-[290px] md:ml-0 pt-0 md:w-12 md:h-10"
            >
              <img src="/asset/sort.svg" alt="Sort" />
            </button>
            <div
              className={`absolute right-0 border border-gray-300 rounded-md z-10 bg-white shadow-lg transform transition-all duration-200 ${
                isDropdownVisible
                  ? "translate-y-0 opacity-100 visible"
                  : "translate-y-[-5px] opacity-0 invisible"
              }`}
            >
              <ul className="p-2">
                <li
                  onClick={() => {
                    handleSortSelection("Latest");
                  }}
                  className="flex items-center whitespace-nowrap py-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    className="mr-2"
                    checked={sortBy === "Latest"}
                    readOnly
                  />
                  <span>Latest</span>
                </li>
                <li
                  onClick={() => {
                    handleSortSelection("Most Popular");
                  }}
                  className="flex items-center whitespace-nowrap py-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    className="mr-2"
                    checked={sortBy === "Most Popular"}
                    readOnly
                  />
                  <span>Most Popular</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Forum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 h-auto mt-6 ml-4">
          {filteredForums.map((forum, index) =>
            forum ? (
              <div
                key={forum.forum_id || index}
                className="flex flex-col w-full h-full justify-center items-center group relative"
              >
                <div
                  className="w-full md:w-80 h-56 justify-center items-center rounded-3xl overflow-hidden cursor-pointer"
                  style={{ backgroundColor: forum.wallpaper || "basegreen" }}
                  onClick={() => joinForum(forum.forum_name, forum.board)}
                >
                  {forum.icon && (
                    <img
                      src={`data:image/jpeg;base64,${forum.icon}`}
                      alt={`${forum.forum_name || "Forum"} icon`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="text-lg md:text-2xl font-bold mt-2 self-start ml-4 md:ml-14 z-10">
                  {forum.forum_name || "Unnamed Forum"}
                </h3>
                <div className="overlay-content absolute w-full md:w-340 h-72 opacity-0 rounded-3xl group-hover:opacity-100 bg-black bg-opacity-60 group-hover:pointer-events-none">
                  <p className="mx-4 md:mx-10 my-4 md:my-10 text-white">
                    {forum.description || "No description available"}
                  </p>
                </div>
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

export default BookmarkView;
