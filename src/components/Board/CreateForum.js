import React, { useEffect, useRef, useState, useContext } from 'react';
import HeadingSection from './HeadingSection';
import AppearanceSection from './AppearanceSection';
import AccessSection from './AccessSection';
import TagSection from './TagSection';
import { createForum, fetchForums, createAccess } from '../../api';
import { UserContext } from '../../UserContext';

const CreateForum = ({ isVisible, closeCreateForum, board, onForumCreated }) => {
  const [activeSection, setActiveSection] = useState('heading');
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState(null);
  const [description, setDescription] = useState('');
  const [wallpaper, setWallpaper] = useState('#006b62');
  const [font, setFont] = useState(0);
  const [sortby, setSortBy] = useState(0);
  const [access, setAccess] = useState(0);
  const [allowed, setAllowed] = useState([]);
  const [tags, setTags] = useState([]);
  const [btags, setBoardTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, status } = useContext(UserContext);

  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const appearanceRef = useRef(null);
  const accessRef = useRef(null);
  const tagsRef = useRef(null);
  const underlineRef = useRef(null);
  const buttonsRef = useRef([]);

  const scrollToSection = (sectionRef) => {
    const headerHeight = 176;
    const panelElement = document.getElementById('createforum');
    const scrollContainer = panelElement.querySelector('.overflow-y-scroll');
  
    if (sectionRef && sectionRef.current) {
      const sectionPosition = sectionRef.current.offsetTop;
      const offsetPosition = sectionPosition - headerHeight;
  
      scrollContainer.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      // Scroll to the bottom if the section reference is not available
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
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
    const loadForums = async () => {
        setLoading(true);
        try {
            const data = await fetchForums(board);
            if (!data || !data.forums || !Array.isArray(data.forums)) {
                throw new Error("Invalid data format");
            }
            console.log("Fetched Forums:", data.forums);
            setBoardTags(data.tags);
        } catch (error) {
            console.error("Failed to load forums", error);
            setError("Failed to load forums. " + (error.message || ''));
        } finally {
            setLoading(false);
        }
    };
    
    loadForums();
}, [board]);  

  const handleCreate = async () => {
    if (title.trim() === '') {
      alert('Title cannot be empty!');
      return;
    }

    const forumData = {
      forum_name: title,
      description: description,
      icon: icon,
      wallpaper: wallpaper,
      access: access,
      font: font,
      sortby: sortby,
      creator_id: user.sid, // Replace with actual creator ID
      board: board, // Include the board
      tags: tags
    };

    try {
      console.log(forumData);
      const createdForum = await createForum(board, forumData); // Create forum
      console.log('Created forum:', createdForum);

      if (access === 0) {
        for (const user_id of allowed) {
          await createAccess(board, createdForum.slug, user_id);
        }
      }

      onForumCreated(createdForum); // Pass the newly created forum

      // Clear the inputs after creating
      setTitle('');
      setDescription('');
      setIcon(null);
      setWallpaper('#D9D9D9');
      setFont(0);
      setSortBy(0)
      setAccess(0);
      setTags([]);

      closeCreateForum(); // Close the modal after successful creation
    } catch (error) {
      if (error.response) {
        console.error('Error creating forum:', error.response.data); // Log full error response
      } else {
        console.error('Error creating forum:', error.message);
      }
      alert('Error creating forum. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div ref={panelRef} id="createforum" className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div className="bg-white w-panel h-630 rounded-2xl shadow-lg relative overflow-y-scroll overflow-x-hidden rounded-b-none scrollbar-hide">
        <div className="w-full h-44 shadow-lg p-7 rounded-t-2xl sticky top-0 bg-white z-10">
          <button onClick={closeCreateForum} className="absolute top-0 left-0 w-12 h-12 m-7 bg-gray-400 hover:bg-gray-300 rounded-xl text-3xl text-white font-extrabold">
            &times;
          </button>
          <h1 className="text-4xl text-center mt-2 text-black font-bold ">Create Forum</h1>
          <div className="relative my-7 flex justify-center">
            <div ref={underlineRef} id="underline" className="absolute bottom-0 h-1 bg-basegreen transition-all duration-300"></div>
            {['heading', 'appearance', 'access', 'tags'].map((section, index) => (
              <button
                key={section}
                ref={el => (buttonsRef.current[index] = el)}
                onClick={() => {
                  const sectionRefs = { heading: headingRef, appearance: appearanceRef, access: accessRef, tags: tagsRef };
                  scrollToSection(sectionRefs[section]);
                  setActiveSection(section);
                  setUnderlinePosition(index);
                }}
                className={`flex-grow mx-1 py-3 text-xl font-semibold ${activeSection === section ? 'text-basegreen' : 'text-black'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreate}
            className={`absolute top-0 right-0 w-20 h-12 m-7 bg-basegreen text-white rounded px-4 py-2 ${title.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={title.trim() === ''}
          >
            Create
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
            />
          </div>
          <div ref={accessRef}>
          <AccessSection 
              handleAccess={setAccess} 
              allowed={allowed} 
              setAllowed={setAllowed} 
          />
          </div>
          <TagSection tags={tags} btags={btags} setTags={setTags} />
        </div>
      </div>
    </div>
  );
};

export default CreateForum;
