import React, { useState } from "react";

const AppearanceSection = ({
  setWallpaper,
  setFont,
  setSortBy,
  wallpaper,
  font,
  sortby,
}) => {
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState({
    text: "Select Sort",
    icon: null,
  });

  const handleSortSelection = (sortby, text, icon) => {
    setSortBy(sortby); // Send the sort selection back to parent
    setSelectedSort({ text, icon });
    setSortDropdownVisible(false);
  };

  return (
    <div className="p-2">
      <h1 className="text-gray1 font-bold text-2xl pl-5 -mb-3">Appearance</h1>
      <div className="w-490 md:w-500 h-fit bg-basegreen mt-4 rounded-2xl py-4 px-10 flex flex-col items-center">
        {/* Wallpaper Section with Color Input */}
        <div className="justify-between flex w-full">
          <h2 className="text-xl self-start m-1 mt-11 font-bold text-white">
            Wallpaper
          </h2>
          <div className="flex flex-row items-center space-x-2">
            <input
              type="color"
              className="w-44 h-28 rounded-xl mr-4 border-0 outline-none cursor-pointer"
              value={wallpaper}
              onChange={(e) => {
                setWallpaper(e.target.value); // Update parent state with selected color
              }}
              style={{
                backgroundColor: wallpaper,
                appearance: "none",
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            />
          </div>
        </div>

        <div className="my-4 flex justify-center">
          <div className="w-350 md:w-430 h-0.5 bg-darkgreen"></div>
        </div>

        {/* Font Selection Section */}
        <div className="justify-between flex w-full">
          <h2 className="text-xl self-start m-1 mt-4 font-bold text-white">
            Font
          </h2>
          <div className="flex flex-row items-center space-x-4">
            <button
              className={`text-lg font-['Istok Web'] text-[20px] font-bold w-20 h-14 rounded-xl ${
                font === 0
                  ? "bg-white text-basegreen"
                  : "bg-graygreen text-gray1"
              }`}
              onClick={() => setFont(0)}
            >
              ABab
            </button>
            <button
              className={`text-lg font-['Tinos'] text-[20px] font-bold w-20 h-14 rounded-xl ${
                font === 1
                  ? "bg-white text-basegreen"
                  : "bg-graygreen text-gray1"
              }`}
              onClick={() => setFont(1)}
            >
              ABab
            </button>
            <button
              className={`text-lg font-['Playpen_Sans'] text-[20px] font-bold w-20 h-14 rounded-xl ${
                font === 2
                  ? "bg-white text-basegreen"
                  : "bg-graygreen text-gray1"
              }`}
              onClick={() => setFont(2)}
            >
              ABab
            </button>
          </div>
        </div>

        <div className="my-4 flex justify-center">
          <div className="w-350 md:w-430 h-0.5 bg-darkgreen"></div>
        </div>

        {/* Sort by Section */}
        <div className="justify-between flex w-full">
          <h2 className="text-xl self-start m-1 mt-4 font-bold text-white">
            Sort by
          </h2>
          <div className="relative">
            <div
              className="bg-white w-56 h-14 rounded-[20px] flex items-center justify-between p-2 cursor-pointer"
              onClick={() => setSortDropdownVisible(!sortDropdownVisible)}
            >
              <div className="flex items-center">
                {selectedSort.icon && (
                  <img
                    src={selectedSort.icon}
                    className="w-8 h-8 mr-2 ml-2"
                    alt={selectedSort.text}
                  />
                )}
                <p className="text-black font-bold text-[18px] ml-2">
                  {selectedSort.text}
                </p>
              </div>
              <button className="flex items-center justify-center ">
                <img
                  src="/asset/down.svg"
                  alt="Down arrow"
                  className={`w-10 h-10 mr-1 ${
                    sortDropdownVisible
                      ? "transform scale-y-[-1]"
                      : "transform scale-y-[1]"
                  }`}
                />
              </button>
            </div>
            <div
              className={`absolute right-0 mt-2 border border-gray-300 rounded-md bg-white shadow-lg w-56 z-10 transform transition-all duration-200 ease-in-out ${
                sortDropdownVisible
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              <ul className="p-2">
                <li
                  onClick={() =>
                    handleSortSelection(0, "Latest", "/asset/lastest_icon.svg")
                  }
                  className="flex items-center p-2 hover:bg-gray-200 hover:border hover:rounded-md cursor-pointer"
                >
                  <img
                    src="/asset/lastest_icon.svg"
                    className="w-8 h-8 mr-4"
                    alt="Latest"
                  />
                  <span className="font-bold">Latest</span>
                </li>
                <li
                  onClick={() =>
                    handleSortSelection(1, "Likes", "/asset/heart_icon.svg")
                  }
                  className="flex items-center p-2 hover:bg-gray-200 hover:border hover:rounded-md cursor-pointer"
                >
                  <img
                    src="/asset/heart_icon.svg"
                    className="w-8 h-8 mr-4"
                    alt="Likes"
                  />
                  <span className="font-bold">Likes</span>
                </li>
                <li
                  onClick={() =>
                    handleSortSelection(
                      2,
                      "Comments",
                      "/asset/comment_icon.svg"
                    )
                  }
                  className="flex items-center p-2 hover:bg-gray-200 hover:border hover:rounded-md cursor-pointer "
                >
                  <img
                    src="/asset/comment_icon.svg"
                    className="w-8 h-8 mr-4"
                    alt="Comments"
                  />
                  <span className="font-bold">Comments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
