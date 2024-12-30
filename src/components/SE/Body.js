import React, { useState, useEffect } from 'react';

const Body = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBanner((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-white">
      <div className="flex justify-center items-center py-10">
        <img
          src="/asset/ecc.jpg"
          className="w-10/12 object-contain"
          alt="SE"
        />
      </div>

      <section className="flex flex-wrap items-center justify-center px-5 py-10 lg:px-20">
        <div className="flex flex-col w-750 h-96 items-center mb-5 lg:mb-0 rounded-md bg-graygreen p-4 overflow-hidden relative">
          <div
            className={`transition-transform duration-500 ease-in-out absolute w-full h-full flex items-center justify-center ${
              showBanner ? 'transform translate-x-0' : 'transform -translate-x-full'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                src="/asset/ai_hackathon.jpg"
                alt="International AI Hackathon"
                className="w-9/12 object-contain rounded-lg"
              />
              <p className="mt-2 text-center">
                <a href="https://se.kmitl.ac.th/news/14" className="text-black underline">
                  International AI Hackathon
                </a>
              </p>
            </div>
          </div>

          <div
            className={`transition-transform duration-500 ease-in-out absolute w-full h-full flex items-center justify-center ${
              !showBanner ? 'transform translate-x-0' : 'transform translate-x-full'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                src="/asset/admission_first_round.png"
                alt="Direct Admission"
                className="w-10/12 object-contain rounded-lg"
              />
              <p className="mt-2 text-center">
                <a href="https://se.kmitl.ac.th/news/13" className="text-black underline">
                  Direct Admissions 1-1 (Early Round) for SE Thai Students 2025
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="ml-10 p-4 w-430">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Your_Time_Zone"
            title="Event Calendar"
            className="w-full h-72 rounded-lg bg-graygreen"
          />
        </div>
      </section>

      <section className="px-5 py-10 lg:px-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-graygreen text-black p-5 rounded-lg shadow-lg">
          <img
            src="/asset/event.jpg"
            alt="Event"
            className="w-full h-40 object-cover rounded-lg"
          />
          <h3 className="mt-3 font-bold text-lg">Event</h3>
          <p className="mt-2 text-sm">
            We are renowned for our quality of teaching and have been awarded the highest grade in every national assessment.
          </p>
          <a href="#event" className="mt-3 inline-block text-blue-600 hover:underline">
            Find out more →
          </a>
        </div>
        <div className="bg-graygreen text-black p-5 rounded-lg shadow-lg">
          <img
            src="/asset/research.jpg"
            alt="Research"
            className="w-full h-40 object-cover rounded-lg"
          />
          <h3 className="mt-3 font-bold text-lg">Research</h3>
          <p className="mt-2 text-sm">
            Our mission is to develop world-leading research and translate its key aspects into areas of societal importance.
          </p>
          <a href="#research" className="mt-3 inline-block text-blue-600 hover:underline">
            Find out more →
          </a>
        </div>
        <div className="bg-graygreen text-black p-5 rounded-lg shadow-lg">
          <img
            src="/asset/industry.jpg"
            alt="Industry"
            className="w-full h-40 object-cover rounded-lg"
          />
          <h3 className="mt-3 font-bold text-lg">Industry</h3>
          <p className="mt-2 text-sm">
            We maintain successful relations with industry, with collaborations including projects, placements, and internships.
          </p>
          <a href="#industry" className="mt-3 inline-block text-blue-600 hover:underline">
            Find out more →
          </a>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-20 bg-lightgreen">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/3 mb-5 lg:mb-0 flex justify-center lg:justify-start">
            <img
              src="/asset/relax-in-sofa.svg"
              alt="Newsletter Illustration"
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="w-full lg:w-2/3 text-center lg:text-left">
            <h3 className="text-lg font-bold">Subscribe To Our Newsletter</h3>
            <p className="text-sm mt-2">
              Don’t lose a chance to be among the first to know about our upcoming news and updates.
            </p>
            <form className="mt-5 flex flex-col lg:flex-row items-center lg:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-lg text-black w-full lg:w-80 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-basegreen rounded-r-lg text-white mt-3 lg:mt-0 lg:ml-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Body;
