import React, { useState, useEffect, useContext } from "react";
import { fetchForums } from "../../api";
import { UserContext } from "../../UserContext";

const LeftTab = ({ board, setTagFiltered }) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[new Date().getDay()];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [search, setSearch] = useState("");
  const { user, status } = useContext(UserContext);
  const name = status === "se" ? user.sid : user.aid;

  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      try {
        const data = await fetchForums(board);
        if (!data || !data.tags || !Array.isArray(data.tags)) {
          throw new Error("Invalid data format");
        }
        setTags(data.tags);
      } catch (error) {
        console.error("Failed to load forums", error);
        setError("Failed to load forums. " + (error.message || ""));
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [board]);

  const handleTagClick = (tagId) => {
    if (selectedTags.includes(tagId)) {
      const updatedTags = selectedTags.filter((id) => id !== tagId);
      setSelectedTags(updatedTags);
      setTagFiltered(updatedTags);
    } else {
      const updatedTags = [...selectedTags, tagId];
      setSelectedTags(updatedTags);
      setTagFiltered(updatedTags);
    }
  };

  const clearTags = () => {
    setSelectedTags([]);
    setTagFiltered([]);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredTags = tags.filter((tag) =>
    tag.tag_text.toLowerCase().includes(search.toLowerCase())
  );

  const displayTags = () => {
    const unselectedTags = filteredTags.filter(
      (tag) => !selectedTags.includes(tag.tag_id)
    );
    return [
      ...tags.filter((tag) => selectedTags.includes(tag.tag_id)),
      ...unselectedTags.slice(0, 5),
    ];
  };

  return (
    <div className="w-[200px] md:w-80 lg:w-96 h-full flex flex-col items-center px-2 md:px-0 border-lightgreen border-r-2 md:border-r-4">
      <h2 className="text-xl md:text-3xl text-gray1 font-bold text-center mt-12">
        Hello, {name} <br /> Happy {currentDay}!
      </h2>
      <div className="bg-white rounded-full h-9 w-full md:w-72 drop-shadow-md pt-1 px-4 mt-5 md:mt-6">
        <input
          type="text"
          className="w-full bg-transparent text-gray-600 text-sm md:text-[15px] lg:text-lg outline-none placeholder-gray-400  cursor-pointer"
          placeholder={"\uD83D\uDD0D Search category..."}
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-full flex flex-row justify-between">
        <h3 className="text-gray1 text-[20px] md:text-2xl font-bold self-start ml-3 md:ml-16 mt-6 flex-col">
          Category
        </h3>
        <button
          type="button"
          onClick={() => clearTags()}

          className="mt-6 md:mt-6 mr-4 md:mr-16 text-[12px] md:text-[16px] relative text-blue-600 font-bold cursor-pointer after:absolute after:left-0 after:bottom-[7px] md:after:bottom-[5px] after:h-[1px] after:w-full after:bg-[#0a66c2] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
          clear tags
        </button>
      </div>
      <div className="w-full h-full flex flex-col items-center mt-4">
        <div className="flex flex-wrap justify-center px-2 md:px-6">
          {displayTags().map((tag) => (
            <button
              key={tag.tag_id}
              className={`m-1 px-2 md:px-3 py-1 md:py-2 text-[16px] md:text-[16px] rounded-md text-white ${
                selectedTags.includes(tag.tag_id)
                  ? "bg-basegreen"
                  : "bg-graygreen"
              }`}
              onClick={() => handleTagClick(tag.tag_id)}
            >
              {tag.tag_text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftTab;
