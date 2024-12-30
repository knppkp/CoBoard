import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookmarkView from "./BookmarkView";
import BookmarkEdit from "./BookmarkEdit";
import { UserContext } from '../../../UserContext';
import { fetchUserData } from "../../../api";

const MainBody = ({ board, searchForumTerm = "" }) => {  
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [forums, setForums] = useState([]);
  const [bookmarkedForums, setBookmarkedForums] = useState([]);
  const [filteredBookmarkedForums, setFilteredBookmarkedForums] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { user, status } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const response = await fetchUserData(id);
        setUserData(response);
        const bookmarks = response.bookmarked || [];
        setBookmarkedForums(bookmarks);
        setFilteredBookmarkedForums(bookmarks);
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [id]);

  useEffect(() => {
    let sortedForums = [...bookmarkedForums];

    if (searchForumTerm) {
      sortedForums = sortedForums.filter(forum =>
        forum.forum_name?.toLowerCase().includes(searchForumTerm.toLowerCase())
      );
    }

    if (sortBy === 'Latest') {
      sortedForums.sort((a, b) => b.forum_id - a.forum_id);
    } else if (sortBy === 'Most Popular') {
      sortedForums.sort((a, b) => b.total_contributors - a.total_contributors);
    }

    setFilteredBookmarkedForums(sortedForums);
  }, [searchForumTerm, bookmarkedForums, sortBy]);

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleSortSelection = (option) => {
    setSortBy(option);
  };

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  return (
    <div>
      {isEditing ? (
        <BookmarkEdit
          isDropdownVisible={isDropdownVisible}
          userData={userData}
          loading={loading}
          error={error}
          sortBy={sortBy}
          forums={bookmarkedForums}
          setForums={setForums}
          filteredForums={filteredBookmarkedForums}
          setFilteredForums={setFilteredBookmarkedForums}
          toggleDropdown={toggleDropdown}
          handleSortSelection={handleSortSelection}
          navigate={navigate}
          onEditClick={handleEditToggle}
        />
      ) : (
        <BookmarkView
          isDropdownVisible={isDropdownVisible}
          userData={userData}
          loading={loading}
          error={error}
          sortBy={sortBy}
          forums={bookmarkedForums}
          filteredForums={filteredBookmarkedForums}
          toggleDropdown={toggleDropdown}
          handleSortSelection={handleSortSelection}
          navigate={navigate}
          onEditClick={handleEditToggle}
        />
      )}
    </div>
  );
};

export default MainBody;
