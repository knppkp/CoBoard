import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { fetchUserData } from "../../api";

const LeftTab = () => {
  const { user, status } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  const [created, setCreated] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Get the current location

  const sidebars = [
    { label: "Profile", link: `/user/${id}/profile` },
    { label: "Your Board", link: `/user/${id}/yourboard` },
    { label: "Bookmarks", link: `/user/${id}/yourbookmark` },
    { label: "File Archive", link: `/user/${id}/yourarchive` },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetchUserData(id);
        setCreated(response.created || []);
        setBookmarked(response.bookmarked || []);
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full md:w-64 h-full bg-white shadow-md flex">
      <div className="flex-grow flex flex-col">
        {sidebars.map((part, index) => (
          <div key={part.label}>
            <Link
              to={part.link}
              className={`flex justify-between items-center p-4 md:p-6 text-gray-700 transition-colors duration-200 flex-1 ${
                location.pathname === part.link
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="flex-grow text-base md:text-lg font-semibold text-right">
                {part.label}
              </span>
              <span className="text-gray-600 ml-1 text-sm md:text-base">
                {" "}
                {part.label === "Your Board" && <span>({created.length})</span>}
                {part.label === "Bookmarks" && (
                  <span>({bookmarked.length})</span>
                )}
              </span>
            </Link>
            {index < sidebars.length - 1 && (
              <hr className="border-t border-gray-300 my-0" />
            )}
          </div>
        ))}
      </div>
      <div className="w-0.5 md:w-1 bg-lightgreen"></div>
    </div>
  );
};

export default LeftTab;
