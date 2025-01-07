import React, { useEffect, useState } from 'react';
import { fetchTopics } from '../../api';

const InfoPanel = ({ isVisible, closeInfoPanel, board, forum_name }) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState(null);
  const [access, setAccess] = useState(0);
  const [creator_id, setCreatorID] = useState('12345678');
  const [creator, setCreator] = useState('');
  const [createdTime, setCreatedTime] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [topic, setTopic] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalReactions, setTotalReactions] = useState(0);
  const [totalContributors, setContributor] = useState(0); 

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await fetchTopics(board, forum_name);
        setTitle(response.forum_name);
        setIcon(response.icon);
        setCreatorID(response.creator_id);
        setCreator(response.creator || '');
        setTopic(response.topics);
        setAccess(response.access.map(item => item.user_id));

        const createdDate = new Date(response.created_time);
        setCreatedTime(createdDate);

        const updatedDate = new Date(response.last_updated);
        setLastUpdated(updatedDate);

        let postsCount = 0;
        let commentsCount = 0;
        let reactionsCount = 0;
        const contributorsSet = new Set();
  
        response.topics.forEach(topic => {
          postsCount += topic.posts.length;
          
          topic.posts.forEach(post => {
            // Add the post creator to the contributors set
            contributorsSet.add(post.spost_creator || post.apost_creator);
  
            commentsCount += post.comments.length;
            reactionsCount += post.heart;
  
            post.comments.forEach(comment => {
              // Add the comment creator to the contributors set
              contributorsSet.add(comment.scomment_creator || comment.acomment_creator);
              reactionsCount += comment.comment_heart;
            });
          });
        });
  
        setTotalPosts(postsCount);
        setTotalComments(commentsCount);
        setTotalReactions(reactionsCount);
        setContributor(contributorsSet.size);
  
      } catch (error) {
        console.error("Failed to load topics", error);
      }
    };
  
    loadTopics();
  }, [board, forum_name]);

  if (!isVisible) return null;

  return (
    <div id="infopanel" className="fixed inset-0 z-20 flex items-end justify-end bg-black bg-opacity-50">
      <div className="bg-darkorange w-[500px] md:w-panel h-screen p-7 rounded-2xl rounded-r-none shadow-lg relative overflow-y-scroll overflow-x-hidden scrollbar-hide">
        <button
          onClick={closeInfoPanel}
          className="absolute top-0 left-0 w-14 h-14 ml-7 mt-12 text-4xl text-white font-extrabold"
        >
          &times;
        </button>
        <h1 className="text-4xl text-center mt-7 text-white font-bold">About this forum</h1>
        <div className="w-450 md:w-500 h-80 bg-white mt-12 rounded-2xl flex justify-center items-center">
          {icon && (
            <img 
              src={`data:image/jpeg;base64,${icon}`}
              alt={`${title} icon`} 
              className="w-450 h-80 md:w-full md:h-full object-cover rounded-2xl"
            />
          )}
        </div>
        <h1 className="text-white font-bold text-3xl mt-5 ml-3">{title}</h1>
        <div className="w-450 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-4 px-10 flex flex-col items-center">
          <div className="flex flex-row justify-between w-full mt-1">
            <p className="text-lg font-semibold text-gray1">Made by</p>
            <p className="text-lg font-semibold text-black">{creator || creator_id}</p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg font-semibold text-gray1">Made on</p>
            <p className="text-lg font-semibold text-black">
              {createdTime.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg font-semibold text-gray1">Last update on</p>
            <p className="text-lg font-semibold text-black">
              {lastUpdated.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full mb-1">
            <p className="text-lg font-semibold text-gray1">Access</p>
            <p className="text-lg font-semibold text-black">{access.length !== 0 ? 'Private' : 'Public'}</p>
          </div>
        </div>
        <div className="w-450 md:w-500 h-fit bg-lightorange mt-6 rounded-2xl py-4 px-10 flex flex-col items-center">
          <div className="flex flex-row justify-between w-full mt-1">
            <p className="text-lg font-semibold text-gray1">Contributors</p>
            <p className="text-lg font-semibold text-black ">{totalContributors}</p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg font-semibold text-gray1">Topics</p>
            <p className="text-lg font-semibold text-black">{topic.length}</p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg font-semibold text-gray1">Posts</p>
            <p className="text-lg font-semibold text-black">{totalPosts}</p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full">
            <p className="text-lg font-semibold text-gray1">Comments</p>
            <p className="text-lg font-semibold text-black">{totalComments}</p>
          </div>
          <div className="my-4 flex justify-center">
            <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
          </div>
          <div className="flex flex-row justify-between w-full mb-1">
            <p className="text-lg font-semibold text-gray1">Reactions</p>
            <p className="text-lg font-semibold text-black">{totalReactions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
