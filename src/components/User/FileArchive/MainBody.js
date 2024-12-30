import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../UserContext"
import { fetchUserData } from "../../../api";
import FileArchive from "./FileArchive";

const MainBody = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [searchForumTerm, setSearchForumTerm] = useState('');

  const { user, status } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetchUserData(id);
        setUserData(response);
        setForums(response.created || []);
        setFilteredForums(response.created || []);
      } catch (err) {
        setError(err.response ? err.response.data.detail : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    let sortedForums = [...forums];

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

    setFilteredForums(sortedForums);
  }, [searchForumTerm, forums, sortBy]);

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleSortSelection = (option) => {
    setSortBy(option);
  };


  return (
    <div>
        <FileArchive
          isDropdownVisible={isDropdownVisible}
          userData={userData}
          loading={loading}
          error={error}
          sortBy={sortBy}
          forums={forums}
          filteredForums={filteredForums}
          searchForumTerm={searchForumTerm}
          toggleDropdown={toggleDropdown}
          handleSortSelection={handleSortSelection}
          navigate={navigate}
        />
      
    </div>
  );
};

export default MainBody;
