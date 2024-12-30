import React, { useEffect, useRef, useState } from 'react';
import HeadingSection from './HeadingSection';
import AppearanceSection from './AppearanceSection';
import AccessSection from './AccessSection';
import TagSection from './TagSection';
import { updateForum, fetchTopics, deleteAccess, createAccess } from '../../api';

const SettingPanel = ({ isVisible, closeSettingPanel, board, forum_name}) => {
  const [activeSection, setActiveSection] = useState('heading');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(null);
  const [wallpaper, setWallpaper] = useState('#006b62');
  const [font, setFont] = useState(0);
  const [sortby, setSortBy] = useState(0);
  const [access, setAccess] = useState(0);
  const [creator_id, setCreatorID] = useState('12345678');
  const [tags, setTags] = useState([]);
  const [btags, setBoardTag] = useState([]);
  const [allowed, setAllowed] = useState([]);
  
  // Create references for each section and buttons
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const appearanceRef = useRef(null);
  const accessRef = useRef(null);
  const tagsRef = useRef(null);
  const underlineRef = useRef(null);
  const buttonsRef = useRef([]);

  const scrollToSection = (sectionRef) => {
    const headerHeight = 176;
    const panelElement = document.getElementById('settingpanel');
    const sectionPosition = sectionRef.current.offsetTop;
    const offsetPosition = sectionPosition - headerHeight;

    panelElement.querySelector('.overflow-y-scroll').scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
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
    const loadTopics = async () => {
        try {
          const response = await fetchTopics(board, forum_name);
          setTitle(response.forum_name);
          setDescription(response.description);
          setIcon(response.icon);
          setWallpaper(response.wallpaper);
          setFont(response.font);
          setSortBy(response.sortby);
          setCreatorID(response.creator_id);
          setTags(response.tags);
          setBoardTag(response.btags);
          setAllowed(response.access.user_id);
        } catch (error) {
          console.error("Failed to load topics", error);
        }
    };

    loadTopics();
  }, [board, forum_name]);

  const handleSubmit = async () => {
    if (title.trim() === '') {
      alert('Title cannot be empty!');
      return;
    }

    const forumData = {
      forum_name: title,
      description: description,
      icon: icon,
      wallpaper: wallpaper,
      font: font,
      sort_by: sortby,
      creator_id: creator_id,
      board: board,
      tags: tags,
    };

    try {
      await deleteAccess(board, forum_name);

      if (access === 0) {
        for (const user_id of allowed) {
          await createAccess(board, forum_name, user_id);
        }
      }

      // Update the forum information
      const updatedForum = await updateForum(board, forum_name, forumData);
      console.log("updated:", forumData);

      await deleteAccess(board, forum_name);

      if (access === 0) {
        for (const user_id of allowed) {
          await createAccess(board, forum_name, user_id);
        }
      }

      closeSettingPanel();
    } catch (error) {
      console.error('Error updating forum:', error.response?.data);
      alert('Error updating forum. Please try again.');
    }
  };

  
  

  if (!isVisible) return null;

  return (
    <div ref={panelRef} id="settingpanel" className="fixed inset-0 z-20 flex items-end justify-end bg-black bg-opacity-50">
      <div className="bg-darkorange w-panel h-screen rounded-2xl rounded-r-none shadow-lg relative overflow-y-scroll overflow-x-hidden scrollbar-hide">
        <div className="w-full h-44 shadow-lg p-7 rounded-bl-2xl sticky top-0 bg-darkorange z-10">
          <button onClick={closeSettingPanel} className="absolute top-0 left-0 w-14 h-14 m-7 text-4xl text-white font-extrabold">
            &times;
          </button>
          <h1 className="text-4xl text-center mt-2 text-white font-bold">Setting</h1>
          <div className="relative my-7 flex justify-center">
            <div ref={underlineRef} id="underline" className="absolute bottom-0 h-1 bg-white transition-all duration-300"></div>
            {['heading', 'appearance', 'access', 'tags'].map((section, index) => (
              <button
                key={section}
                ref={el => (buttonsRef.current[index] = el)}
                onClick={() => {
                  // Map section names directly to refs
                  const sectionRefs = { heading: headingRef, appearance: appearanceRef, access: accessRef, tags: tagsRef };
                  scrollToSection(sectionRefs[section]);
                  setActiveSection(section);
                  setUnderlinePosition(index);
                }}
                className={`flex-grow mx-1 py-3 text-xl font-semibold ${activeSection === section ? 'text-white' : 'text-black'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className={`absolute top-0 right-0 w-20 h-12 m-7 bg-basegreen hover:bg-basegreenhover text-white rounded px-4 py-2 ${title.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Update
          </button>
        </div>
        
        {/* Sections */}
        <div className="p-6">
        <div ref={headingRef}>
            <HeadingSection
              setTitle={setTitle}
              setDescription={setDescription}
              setIcon={setIcon}
              title={title}
              description={description}
              icon={icon}
            />
          </div>
          <div ref={appearanceRef}>
            <AppearanceSection
              handleSortBy={(sortOption) => console.log('Sort by:', sortOption)}
              setWallpaper={setWallpaper}
              setFont={setFont}
              setSortBy = {setSortBy}
              wallpaper={wallpaper}
              font={font}
              sortby = {sortby}
              board={board} 
              forum_name={forum_name}
            />
          </div>
          <div ref={accessRef}>
            <AccessSection 
              handleAccess={setAccess} 
              allowed={allowed} 
              setAllowed={setAllowed} 
              board={board} 
              forum_name={forum_name} />
          </div>
          <div ref={tagsRef}>
            <TagSection tags={tags} btags={btags} setTags={setTags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPanel;
