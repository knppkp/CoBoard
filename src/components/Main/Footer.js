import React, { useState } from "react";

const Footer = () => {
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  const toggleAboutUs = () => setIsAboutUsOpen(!isAboutUsOpen);
  const toggleProgram = () => setIsProgramOpen(!isProgramOpen);

  return (
    <footer className="bg-basegreen w-full flex flex-col py-4 md:py-8">
      <div className="w-full flex flex-col lg:flex-row lg:space-y-0 space-y-6 mt-4 px-4 md:px-8">
        {/* About Us Section */}
        <div className="lg:w-full flex flex-col px-4 md:px-6 mb-4 lg:mb-0">
          <button
            className="text-white text-xl md:text-2xl font-bold flex justify-between items-center lg:justify-start"
            onClick={toggleAboutUs}
          >
            About Us
            <img
              src="/asset/trianglew.svg"
              alt="Toggle"
              className={`w-6 h-6 transform transition-transform ${
                isAboutUsOpen ? "rotate-180" : "rotate-0"
              } lg:hidden`}
              onClick={toggleAboutUs}
            />
          </button>
          <div
            className={`mt-2 ${isAboutUsOpen ? "block" : "hidden"} lg:block`}
          >
            <div>
              <a
                href="https://www.se.kmitl.ac.th/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-base md:text-lg block mb-2 relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[43px] md:hover:after:w-[48px]"
              >
                About
              </a>
              <a
                href="https://www.se.kmitl.ac.th/lecturers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-base md:text-lg block relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[67px] md:hover:after:w-[76px]"
              >
                Lecturers
              </a>
            </div>
          </div>
        </div>

        {/* Program Section */}
        <div className="lg:w-full flex flex-col px-4 md:px-6 mb-4 lg:mb-0">
          <button
            className="text-white text-xl md:text-2xl font-bold flex justify-between items-center lg:justify-start"
            onClick={toggleProgram}
          >
            Program
            <img
              src="/asset/trianglew.svg"
              alt="Toggle"
              className={`w-6 h-6 transform transition-transform ${
                isProgramOpen ? "rotate-180" : "rotate-0"
              } lg:hidden`}
              onClick={toggleProgram}
            />
          </button>
          <div
            className={`mt-2 ${isProgramOpen ? "block" : "hidden"} lg:block`}
          >
            <a
              href="https://www.se.kmitl.ac.th/program/6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base md:text-lg block mb-2 relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[191px] md:hover:after:w-[216px]"
            >
              Software Engineering 2024
            </a>
            <a
              href="https://www.se.kmitl.ac.th/program/3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base md:text-lg block mb-2 relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[122px] md:hover:after:w-[138px]"
            >
              KMILT x Glasgow
            </a>
            <a
              href="https://www.se.kmitl.ac.th/program/7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base md:text-lg block mb-2 relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[148px] md:hover:after:w-[166px]"
            >
              KMITL x Queensland
            </a>
            <a
              href="https://www.se.kmitl.ac.th/program/4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base md:text-lg block mb-2 relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[112px] md:hover:after:w-[127px]"
            >
              Exchange Study
            </a>
            <a
              href="https://www.se.kmitl.ac.th/program/5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base md:text-lg block relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-1 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-500 hover:after:w-[77px] md:hover:after:w-[87px]"
            >
              Internships
            </a>
          </div>
        </div>

        {/* Admission, Research, News, Event Section */}
        <div className="lg:w-full flex flex-col px-4 md:px-6 mb-4 lg:mb-0">
          <a
            href="https://www.se.kmitl.ac.th/admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl md:text-2xl font-bold mb-6 cursor-pointer"
          >
            Admission
          </a>
          <a
            href="https://www.se.kmitl.ac.th/research"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl md:text-2xl font-bold mb-6 cursor-pointer"
          >
            Research
          </a>
          <a
            href="https://www.se.kmitl.ac.th/news"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl md:text-2xl font-bold mb-6 cursor-pointer"
          >
            News
          </a>
          <a
            href="https://www.se.kmitl.ac.th/event"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl md:text-2xl font-bold mb-6 cursor-pointer"
          >
            Event
          </a>
        </div>

        {/* Vertical Separator */}
        <div className="hidden lg:block border-l-2 border-white mx-8"></div>

        {/* Follow Us Section */}
        <div className="lg:w-full flex flex-col px-4 md:px-6 mb-4 lg:mb-0">
          <div className="text-white text-xl md:text-2xl font-bold mb-3 text-center">
            Follow Us
          </div>
          <div className="flex flex-row space-x-8 mt-4 justify-center">
            <a
              href="https://www.facebook.com/sekmitl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/asset/facebook.svg"
                alt="Facebook"
                className="w-6 h-6 md:w-8 md:h-8 transition-all duration-300"
                onMouseOver={(e) =>
                  (e.currentTarget.src = "/asset/facebook(hover).svg")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.src = "/asset/facebook.svg")
                }
              />
            </a>
            <a
              href="https://www.instagram.com/se_kmitl/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/asset/instagram.svg"
                alt="Instagram"
                className="w-7 h-7 md:w-9 md:h-9 transition-all duration-300"
                onMouseOver={(e) =>
                  (e.currentTarget.src = "/asset/instagram(hover).svg")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.src = "/asset/instagram.svg")
                }
              />
            </a>
            <a
              href="https://www.youtube.com/@SchoolofEngineeringKMITL/featured"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/asset/youtube.svg"
                alt="YouTube"
                className="w-7 h-7 md:w-9 md:h-9 transition-all duration-300"
                onMouseOver={(e) =>
                  (e.currentTarget.src = "/asset/youtube(hover).svg")
                }
                onMouseOut={(e) => (e.currentTarget.src = "/asset/youtube.svg")}
              />
            </a>
            <a
              href="https://www.linkedin.com/school/สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/asset/linkedin.svg"
                alt="LinkedIn"
                className="w-6 h-6 md:w-8 md:h-8 transition-all duration-300"
                onMouseOver={(e) =>
                  (e.currentTarget.src = "/asset/linkedin(hover).svg")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.src = "/asset/linkedin.svg")
                }
              />
            </a>
          </div>
        </div>
      </div>
      <div className="my-4"></div>
      <div className="w-full flex flex-col lg:flex-row justify-between items-center px-4 md:px-8 mt-4">
        <div className="flex flex-col text-center lg:text-left">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm md:text-base block mb-2 relative"
          >
            Privacy Policy | Policies
          </a>
          <p className="text-white text-sm md:text-base">
            {"\u00A9"} 2024 Software Engineering, King Mongkut's Institute of
            Technology Ladkrabang
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
