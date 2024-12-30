import React from 'react';

const Header = () => {
  return (
    <header className="bg-basegreen text-white px-5 py-3">
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center ml-32">
                <div className="bg-slate-400 rounded-full h-20 w-36 mr-4 flex justify-center items-center relative group">
                    <div className="bg-white rounded-full h-11/12 w-11/12 flex justify-center items-center relative">
                        <img
                            src="/asset/se.png"
                            className="h-11/12 w-11/12 object-contain"
                            alt="SE"
                        />
                    </div>
                    <div className="overlay-content absolute inset-0 rounded-full flex justify-center items-center">
                    </div>
                </div>
                <h1 className="text-4xl text-orange-400">
                    Software Engineering Program @ KMITL
                </h1>
            </div>
        </div>

        <nav className="flex items-center justify-between mt-4 ml-32">
            <ul className="flex flex-wrap space-x-5">
                <li><a href="https://www.se.kmitl.ac.th/about" className="hover:underline text-2xl">About</a></li>
                <li><a href="https://www.se.kmitl.ac.th/program/6" className="hover:underline text-2xl">Program</a></li>
                <li><a href="https://www.se.kmitl.ac.th/admissions" className="hover:underline text-2xl">Admissions</a></li>
                <li><a href="https://www.se.kmitl.ac.th/research" className="hover:underline text-2xl">Research</a></li>
                <li><a href="https://www.se.kmitl.ac.th/industry" className="hover:underline text-2xl">Industry</a></li>
                <li><a href="https://www.se.kmitl.ac.th/news" className="hover:underline text-2xl">News</a></li>
                <li><a href="https://www.se.kmitl.ac.th/event" className="hover:underline text-2xl">Event</a></li>
                <li><a href="/" className="hover:underline text-2xl">CoBoard</a></li>
            </ul>

            <div className="flex items-center space-x-3">
                <input
                type="text"
                placeholder="🔍 Search..."
                className="px-3 py-1 rounded-md text-black placeholder-gray-500"
                />
                <button className="text-xl">👤</button>
            </div>
        </nav>
    </header>
  );
};

export default Header;
