import React, { useEffect, useState } from "react";
import { fetchTopics } from "../../api";
import { formatDistanceToNow } from "date-fns";

const Header = ({ board, forum_name, setSearchTopicTerm }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [creator_id, setCreatorID] = useState("");
  const [createdTime, setCreatedTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");
  const [wallpaper, setWallpaper] = useState("#006b62");
  const [isSearchable, setSearchable] = useState(false);
  const [totalContributors, setContributor] = useState(0);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTopicTerm(event.target.value);
  };

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetchTopics(board, forum_name);
        setTitle(response.forum_name);
        setDescription(response.description);
        setIcon(response.icon);
        setCreatorID(response.creator_id);
        setWallpaper(response.wallpaper);

        const createdDate = new Date(response.created_time);
        setCreatedTime(createdDate);

        const contributorsSet = new Set();

        response.topics.forEach((topic) => {
          topic.posts.forEach((post) => {
            contributorsSet.add(post.spost_creator || post.apost_creator);
            post.comments.forEach((comment) => {
              contributorsSet.add(
                comment.scomment_creator || comment.acomment_creator
              );
            });
          });
        });
        contributorsSet.delete(creator_id);
        setContributor(contributorsSet.size); // Total unique contributors
      } catch (error) {
        console.error("Failed to load topics", error);
      }
    };

    loadTopics();
  }, [board, forum_name, creator_id]);

  // Use effect to calculate elapsed time when `createdTime` is set
  useEffect(() => {
    if (createdTime) {
      const distance = formatDistanceToNow(createdTime);
      setElapsedTime(distance);
    }
  }, [createdTime]);

  // Extract the base path dynamically based on the current URL
  const getBasePath = () => {
    const pathSegments = window.location.pathname.split("/");
    return pathSegments.length > 2
      ? `/${pathSegments[1]}/${pathSegments[2]}`
      : "/";
  };

  return (
    <div
      className="w-full h-52 shadow-2xl sticky top-0 left-0"
      style={{ backgroundColor: wallpaper || "defaultColor" }}
    >
      <a href={getBasePath()} target="_self">
        <div className="flex items-center">
          <div className="h-10 w-10 mt-6 ml-6 flex justify-center items-center">
            <img
              src="/asset/CoBoard logo.svg"
              alt="CoBoard Logo"
              className="w-full h-full"
            />
          </div>
          <p className="text-white mt-6 ml-2 text-sm font-bold">
            Co
            <br />
            Board
          </p>
        </div>
      </a>
      <div className="flex flex-row justify-between mt-4">
        <div className="flex flex-row h-fit w-fit ml-12 mt-4">
          <div className="flex flex-col h-20 w-20 rounded-full bg-white">
            {icon && (
              <img
                src={`data:image/jpeg;base64,${icon}`}
                alt={`${title} icon`}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center ml-6 -mt-3 flex-wrap">
              <h6 className="flex flex-col text-white text-base md:text-lg font-bold">
                {creator_id}
              </h6>
              <h6 className="flex flex-row items-center text-white text-base md:text-lg font-bold ml-0 md:ml-3">
                {totalContributors !== 0 ? `+${totalContributors}` : ""}
                <div className="h-1 w-1 ml-2 md:h-2 md:w-2 md:ml-4 bg-gray-800 rounded-full"></div>
                <span className="ml-2 md:ml-4">{elapsedTime}</span>
              </h6>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white ml-6">
              {title}
            </h1>
            <h4 className="text-lg md:text-xl font-bold text-graygreen ml-6">
              {description}
            </h4>
          </div>
        </div>
        <div
          className={`flex items-center h-11 cursor-pointer ${
            isSearchable ? "w-28 md:w-48" : " w-20 md:w-24"
          } bg-white rounded-xl mr-28 -mt-4 shadow-2xl relative transition-all duration-300 ease-in-out`}
          onClick={() => !isSearchable && setSearchable(true)}
          onMouseLeave={(event) => {
            const inputValue = event.target.querySelector("input")?.value || "";
            if (inputValue === "") {
              setSearchable(false);
            }
          }}
        >
          {isSearchable ? (
            <div className="flex items-center w-full px-2">
              <input
                type="text"
                className="flex-grow bg-transparent outline-none"
                placeholder="Search post..."
                onChange={handleSearch}
                autoFocus
              />
<button
  className="text-gray-700 focus:outline-non text-lg mr-10 font-bold"
  onClick={() => {
    setSearchable(false);
    setSearchTopicTerm(""); // Clear the search value
  }}
>
  &times;
</button>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <p className="text-xl px-2 py-2 cursor-pointer">&#x1F50D;</p>
              <div className="absolute inset-0 rounded-xl hover:bg-black hover:bg-opacity-70"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
