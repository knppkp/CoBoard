import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, status } = useContext(UserContext);
  const profile = status === "se" ? user.sprofile : user.aprofile;
  const id = status === "se" ? user.sid : user.aid;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    alert("Logout successful!");
    navigate("/"); 
  };

  const handleLogoClick = () => {
    window.location.reload(); // Reloads the current window
  };

  return (
    <div className="bg-basegreen w-full h-28 md:h-36 drop-shadow-xl flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center">
        <div
          className="h-16 w-16 md:h-24 md:w-24 ml-4 md:ml-10 flex justify-center items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src="/asset/CoBoard logo.svg"
            className="w-full h-full"
            alt="CoBoard Logo"
          />
        </div>
        <p className="text-white ml-2 md:ml-6 text-xl md:text-3xl font-bold">
          Co
          <br />
          Board
        </p>
      </div>
      <div className="flex items-center">
        <div className="bg-white md:bg-slate-400 rounded-full h-12 w-12 md:h-16 md:w-28 mr-4 md:mr-10 flex justify-center items-center relative group">
          <div className="bg-white rounded-full h-11/12 w-11/12 flex justify-center items-center relative">
            <img
              src="/asset/se.png"
              className="h-full w-full object-contain"
              alt="SE"
            />
          </div>
          <div className="overlay-content absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-60 flex justify-center items-center">
            <a
              href="https://www.se.kmitl.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xs text-center md:text-sm"
            >
              Home Page
            </a>
          </div>
        </div>
        <div
          className="relative bg-white rounded-full h-12 w-12 md:h-16 md:w-16 mr-4 md:mr-10 cursor-pointer flex justify-center items-center"
          onClick={toggleDropdown}
        >
          {profile && (
            <img
              src={`data:image/jpeg;base64,${profile}`}
              alt={`user profile`}
              className="w-full h-full object-cover rounded-full"
            />
          )}
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-[5px] mt-[260px] md:mt-[280px] w-40 md:w-48 text-left bg-white border border-gray-200 shadow-lg rounded-t-md rounded-b-none"
              onMouseLeave={closeDropdown} // Close dropdown when mouse leaves
            >
              <Link
                to={`/user/${id}/profile`}
                className="block px-3 py-2 md:px-4 md:py-2 text-black font-bold hover:bg-[#a1f1d2] w-full flex items-center"
              >
                <img
                  src="/asset/userprofile.svg"
                  alt="Profile"
                  className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4"
                />
                Profile
              </Link>
              <hr className="border-t border-gray-300" />
              {status === "se" && (
                <div>
                  <Link
                    to={`/user/${id}/yourboard`}
                    className="block px-3 py-2 md:px-4 md:py-2 text-black font-bold hover:bg-[#a1f1d2] w-full flex items-center"
                  >
                    <img
                      src="/asset/yourboard.svg"
                      alt="YourBoard"
                      className="h-5 w-5 md:h-7 md:w-7 mr-3"
                    />
                    Your Board
                  </Link>
                  <hr className="border-t border-gray-300" />
                </div>
              )}
              <Link
                to={`/user/${id}/yourbookmark`}
                className="block px-3 py-2 md:px-4 md:py-2 text-black font-bold hover:bg-[#a1f1d2] w-full flex items-center"
              >
                <img
                  src="/asset/bookmark.svg"
                  alt="Bookmark"
                  className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4"
                />
                Bookmarks
              </Link>
              <hr className="border-t border-gray-300" />
              <Link
                to={`/user/${id}/yourarchive`}
                className="block px-3 py-2 md:px-4 md:py-2 text-black font-bold hover:bg-[#a1f1d2] w-full flex items-center"
              >
                <img
                  src="/asset/file_archive.svg"
                  alt="File_Archive"
                  className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4"
                />
                File Archive
              </Link>
              <hr className="border-t border-gray-300" />
              <button
                className="block px-3 py-2 md:px-4 md:py-2 text-black font-bold hover:bg-gray-400 w-full flex items-center"
                onClick={handleLogout}
              >
                <img
                  src="/asset/logout.svg"
                  alt="Logout"
                  className="h-4 w-4 md:h-5 md:w-5 mr-4"
                />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
