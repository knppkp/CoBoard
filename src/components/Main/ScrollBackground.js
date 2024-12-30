import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Admission",
    img: "/asset/admission.jpg",
    link: "/coboard/admission",
  },
  {
    title: "Class Work",
    img: "/asset/classwork.jpg",
    link: "/coboard/classwork",
  },
  {
    title: "Discussion",
    img: "/asset/discussion.jpg",
    link: "/coboard/discussion",
  },
  {
    title: "Education",
    img: "/asset/education.jpg",
    link: "/coboard/education",
  },
  { title: "Alumni", img: "/asset/alumni.jpg", link: "/coboard/alumni" },
];

const carouselImages = [
  "/asset/admission1.jpg",
  "/asset/classwork.jpg",
  "/asset/discussion1.jpg",
  "/asset/education.jpg",
  "/asset/alumni.jpg",
];

const carouselDescriptions = [
  "Connects prospective students with current students for advice and guidance.",
  "Organises assignment submissions, deadline tracking, and solution access.",
  "Encourages casual, non-academic conversations and community building.",
  "Dedicated to academic discussions, resource sharing, and collaborative learning.",
  "Reconnects alumni and students to share experiences and provide career guidance.",
];

const ScrollBackground = ({ status }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000); // Slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollY / documentHeight;
      setScrollPercentage(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigation = (link) => {
    navigate(link);
  };

  const handleSlide = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    } else {
      setCurrentSlide((prev) =>
        prev === 0 ? carouselImages.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSlide("next");
    }, 5000);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  return (
    <div className="scroll-background w-full">
      <div className="flex flex-col justify-center items-center h-fit px-4 md:px-0 bg-basegreen">
        <p className="text-white text-3xl md:text-8xl text-center pt-12 snap-start">
          Welcome to CoBoard
        </p>
        <p className="text-white text-xl md:text-3xl text-center pt-4 md:pt-8">
          What would you like to talk about?
        </p>

        {/* Section 1 */}
        <div className="flex justify-center flex-wrap px-3 w-full md:w-auto">
          {sections.map((section, index) => (
            <div
              key={index}
              className="w-64 md:w-[288px] h-[450px] md:h-[630px] flex justify-center items-center my-6 md:my-10 relative group transition-all duration-300 hover:w-[270px] md:hover:w-[300px]"
            >
              <img
                src={section.img}
                className="h-5/6 w-5/6 object-cover transition-all duration-300 group-hover:w-full"
                alt={section.title}
              />
              <div className="overlay-content absolute bottom-[36px] md:bottom-[52px] w-[213px] md:w-[240px] p-2 md:p-5 flex flex-col items-center bg-gradient-to-t from-zinc-900 to-transparent transition-all duration-300 group-hover:w-[270px] md:group-hover:w-[300px]">
                <h3 className="text-white text-3xl md:text-3xl mb-[10px] md:mb-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {section.title}
                </h3>
                <button
                  onClick={() => handleNavigation(section.link)}
                  className="w-48 md:w-64 h-12 md:h-16 text-white py-2 px-4 mb-[30px] md:mb-[30px] rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex flex-row items-center justify-center">
                    <p className="flex flex-col mr-1 hover:mr-3 duration-400 text-[14px] md:text-lg">
                      Explore {section.title}
                    </p>
                    <p className="text-base md:text-lg flex flex-col">
                      &#8594;
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Section 2 */}
      <div className="flex flex-col md:flex-row mt-8 md:mt-10 items-center justify-center bg-gray-200 p-[250px]">
        <div className="text-center">
          <div className="relative">
            <h2 className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl">
              "Sharing experiences, building connections"
            </h2>
            <blockquote className="mt-6 mx-auto text-xl max-w-screen-sm">
              A dedicated platform for sharing valuable experiences, seeking
              answers to pressing questions, and fostering meaningful
              connections within our
              <a
                href="https://www.se.kmitl.ac.th/"
                className="text-sky-500 font-semibold dark:text-blue-800"
              >
                {" "}
                Software Engineering{" "}
              </a>
              community, where students and alumni alike can collaborate, learn,
              and grow together.
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center space-x-4 text-left">
              <img
                src="/asset/CoBoard logo.svg"
                className="w-14 h-14 rounded-full"
              />
              <div>
                <div className="text-slate-900 font-semibold">CoBoard</div>
                <div className="mt-0.5 text-sm leading-6">
                  An innovative forum platform
                </div>
              </div>
            </figcaption>
          </div>
        </div>
      </div>
      {/* Section 3 */}
      <div className="relative bg-gray-100 h-screen flex-col items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 ml-10 pt-[100px] pb-[50px] p-10 text-center">
          Discover What's Inside!
        </h2>
        <div className="overflow-x-auto flex space-x-6 px-6 snap-x snap-mandatory scrollbar-hide">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className="snap-center flex-shrink-0 w-[50vw] h-[50vh] relative group"
            >
              <img
                src={image}
                alt={`Carousel Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold opacity-0 group-hover:opacity-100 text-center px-6 md:px-12 max-w-[90%] transition-opacity duration-300">
                  {carouselDescriptions[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
};

export default ScrollBackground;
