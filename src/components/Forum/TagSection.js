import React, { useState } from 'react';

const TagSection = React.forwardRef(({ tags, btags, setTags }, ref) => {
  const [searchText, setSearchText] = useState('');

  // Filter `btags` to exclude already selected `tags` and limit to top five for initial display
  const availableTags = btags.filter(btag => !tags.some(tag => tag.tag_id === btag.tag_id));
  const filteredTags = availableTags
    .filter(btag => btag.tag_text.toLowerCase().includes(searchText.toLowerCase()))
    .slice(0, 5);

  const handleAddTag = (tag) => {
    setTags(prevTags => [...prevTags, tag]);
  };

  const handleRemoveTag = (tagId) => {
    setTags(prevTags => prevTags.filter(tag => tag.tag_id !== tagId));
  };

  return (
    <div ref={ref} className="p-2">
      <h1 className="text-white font-bold text-2xl pl-5 -mb-3">Tags</h1>
      <div className="w-490 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-4 px-10 flex flex-col items-center">
        <h2 className="text-xl self-start m-1 font-bold text-blackorange">Tags</h2>
        <div className="bg-white w-350 md:w-430 min-h-10 m-1 rounded-2xl flex flex-wrap p-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag.tag_id}
                className="m-1 px-3 py-2 rounded-md text-white bg-darkorange"
                onClick={() => handleRemoveTag(tag.tag_id)}
              >
                {tag.tag_text}
              </button>
            ))
          ) : (
            <p className="w-full text-gray-500 p-2">No tags used</p>
          )}
        </div>

        <div className="my-4 flex justify-center">
          <div className="w-350 md:w-430 h-0.5 bg-darkorange"></div>
        </div>
        <h2 className="text-xl self-start m-1 font-bold text-blackorange">
          Add Tags
        </h2>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="bg-white w-350 md:w-430 h-10 m-1 p-3 rounded-2xl  cursor-pointer"
        />
        <div className="bg-white w-350 md:w-430 min-h-10 m-1 rounded-2xl flex flex-wrap p-2">
          <p className="w-[100%] p-2">Available Tags</p>
          {filteredTags.map((tag) => (
            <button
              key={tag.tag_id}
              className="m-1 px-3 py-2 rounded-md text-white bg-[#FFAD8B]"
              onClick={() => handleAddTag(tag)}
            >
              {tag.tag_text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default TagSection;
