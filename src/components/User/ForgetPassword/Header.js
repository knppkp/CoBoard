import React, { useContext } from "react";
import { UserContext } from "../../../UserContext";

const Header = () => {
  const { user, status } = useContext(UserContext);
  const profile = status === "se" ? user.sprofile : user.aprofile;

  return (
    <div className="bg-basegreen w-full h-36 drop-shadow-xl flex items-center justify-between sticky top-0 px-4 md:px-10">
      <div className="flex items-center">
        <div className="h-16 w-16 md:h-24 md:w-24 flex justify-center items-center">
          <a href={"/coboard"} target="_self">
            <img
              src="/asset/CoBoard logo.svg"
              className="w-full h-full"
              alt="Logo"
            />
          </a>
        </div>
        <p className="text-white ml-4 md:ml-6 text-2xl md:text-3xl font-bold">
          {" "}
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
              className="h-11/12 w-11/12 object-contain"
              alt="SE"
            />
          </div>
          <div className="overlay-content absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-60 flex justify-center items-center">
            <a
              href="https://www.se.kmitl.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-center text-sm md:text-base lg:text-lg"
            >
              {" "}
              Home Page
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
