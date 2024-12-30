import React from "react";

const Header = () => {
  return (
    // CO BOARD LOGO 
    <div className="bg-basegreen w-full h-20 drop-shadow-xl flex items-center justify-between sticky top-0 z-40 shadow-xl">
      <div className="flex items-center ml-[-20px]">
        <div className="h-16 w-16 ml-10 flex justify-center items-center">
          <img
            src="/asset/CoBoard logo.svg"
            className="w-full h-full"
            alt="Logo"
          />
        </div>
        <p className="font-istok text-white ml-6 text-xl font-extrabold tracking-[4px] leading-[25px]">
          Co
          <br />
          Board
        </p>
      </div>
      {/* SE LOGO */}
      <div className="flex items-center">
        <div className="bg-slate-400 rounded-full h-14 w-24 mr-10 flex justify-center items-center relative group">
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
              className=" text-white"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
