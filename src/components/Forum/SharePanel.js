import React, { useEffect, useRef, useState } from 'react';
import LinkSection from './LinkSection';
import ShareSection from './ShareSection';
import ExportSection from './ExportSection';

const SharePanel = ({ isVisible, closeSharePanel }) => {
  const [activeSection, setActiveSection] = useState('link');

  // Create references for each section and buttons
  const panelRef = useRef(null);
  const linkRef = useRef(null);
  const shareRef = useRef(null);
  const exportRef = useRef(null);
  const underlineRef = useRef(null);
  const buttonsRef = useRef([]);

  const scrollToSection = (sectionRef) => {
    if (sectionRef?.current) {
      const headerHeight = 176;
      const panelElement = document.getElementById('sharepanel');
      const sectionPosition = sectionRef.current.offsetTop;
      const offsetPosition = sectionPosition - headerHeight;

      panelElement.querySelector('.overflow-y-scroll').scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const setUnderlinePosition = (index) => {
    const button = buttonsRef.current[index];
    if (button && underlineRef.current) {
      const buttonRect = button.getBoundingClientRect();
      underlineRef.current.style.width = `${buttonRect.width}px`;
      underlineRef.current.style.left = `${button.offsetLeft}px`;
    }
  };

  useEffect(() => {
    setUnderlinePosition(0); // Set underline for the first button on load
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSharePanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSharePanel]);

  if (!isVisible) return null;

  return (
    <div ref={panelRef} id="sharepanel" className="fixed inset-0 z-20 flex items-end justify-end bg-black bg-opacity-50">
      <div className="bg-darkorange w-[500px] md:w-panel h-screen rounded-2xl rounded-r-none shadow-lg relative overflow-y-scroll overflow-x-hidden scrollbar-hide">
        <div className="w-full h-44 shadow-lg p-7 rounded-bl-2xl sticky top-0 bg-darkorange z-10">
          <button onClick={closeSharePanel} className="absolute top-0 left-0 w-14 h-14 m-7 text-4xl text-white font-extrabold">
            &times;
          </button>
          <h1 className="text-4xl text-center mt-2 text-white font-bold">Share</h1>
          <div className="relative my-7 flex justify-center">
            <div ref={underlineRef} id="underline" className="absolute bottom-0 h-1 bg-white transition-all duration-300"></div>
            {['link', 'share', 'export'].map((section, index) => (
              <button
                key={section}
                ref={el => (buttonsRef.current[index] = el)}
                onClick={() => {
                  const sectionRefs = { link: linkRef, share: shareRef, export: exportRef };
                  scrollToSection(sectionRefs[section]);
                  setActiveSection(section);
                  setUnderlinePosition(index);
                }}
                aria-current={activeSection === section ? 'page' : undefined}
                className={`flex-grow mx-1 py-3 text-xl font-semibold ${activeSection === section ? 'text-white' : 'text-black'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sections */}
        <div className="p-6">
          <div ref={linkRef}><LinkSection /></div>
          <div ref={shareRef}><ShareSection /></div>
          <div ref={exportRef}><ExportSection ref={exportRef} /></div>
        </div>
      </div>
    </div>
  );
};

export default SharePanel;
