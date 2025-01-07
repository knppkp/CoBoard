import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTopics } from '../../api'; 
import { formatDistanceToNow } from 'date-fns';

const Preview = () => {
    const [forumData, setForumData] = useState(null);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedPosts, setExpandedPosts] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState(null);
    const [createdTime, setCreatedTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('');
    const [wallpaper, setWallpaper] = useState('#006b62');
    const [totalContributors, setContributor] = useState(0); 
    const [font, setFont] = useState(0);
    const { board, forum_name } = useParams();
    const [creator_id, setCreatorID] = useState('12345678');
    const [default_sort, setDefaultSort] = useState(0);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const loadTopics = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchTopics(board, forum_name);
                
                if (!response || typeof response !== 'object') {
                    throw new Error("Invalid response from server");
                }
                
                setForumData(response);
                let topics = response.topics || [];

                setFilteredTopics(topics);
                setCreatorID(response.creator_id);
                setFont(response.font);
                setDefaultSort(response.sort_by);
                setTitle(response.forum_name);
                setDescription(response.description);
                setIcon(response.icon);
                setCreatorID(response.creator_id);
                setWallpaper(response.wallpaper);
                
                const createdDate = new Date(response.created_time);
                setCreatedTime(createdDate);

                const contributorsSet = new Set();
        
                response.topics.forEach(topic => {              
                    topic.posts.forEach(post => {
                        contributorsSet.add(post.spost_creator || post.apost_creator);
                        post.comments.forEach(comment => {
                        contributorsSet.add(comment.scomment_creator || comment.acomment_creator);
                        });
                    });
                });
                contributorsSet.delete(creator_id);
                setContributor(contributorsSet.size);
            } catch (error) {
                setError("Failed to load topics. " + (error.message || ''));
            } finally {
                setLoading(false);
            }
        };

        loadTopics();
    }, [board, forum_name, default_sort, creator_id]);

    useEffect(() => {
        if (forumData && forumData.topics) {
            let filtered = forumData.topics;

            // Sort based on the selected option
            if (sortOption === 'latest') {
                filtered.sort((a, b) => b.topic_id - a.topic_id);
            } else if (sortOption === 'popular') {
                filtered.sort((a, b) => (b.posts?.length || 0) - (a.posts?.length || 0));
            } else if (sortOption === 'likes') {
                filtered.sort((a, b) => (b.heart || 0) - (a.heart || 0));
            }

            setFilteredTopics(filtered);
        }
    }, [forumData, sortOption]);

    useEffect(() => {
        if (createdTime) {
            const distance = formatDistanceToNow(createdTime);
            setElapsedTime(distance);
        }
    }, [createdTime]);

    return (
        <div className="w-full h-screen relative overflow-auto flex flex-col bg-graybg">

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div className="flex flex-col w-full h-full">
                    <div className="w-full h-28 fixed top-0 left-0 right-0 z-10">
                        <div 
                            className="w-full h-full shadow-2xl sticky top-0 left-0"
                            style={{ backgroundColor: wallpaper || 'defaultColor' }}
                        >
                            <div className="flex flex-row justify-between py-4">
                                <div className="flex flex-row h-fit w-fit ml-12 mt-4">
                                    <div className="flex flex-col h-14 w-14 rounded-full bg-white">
                                        {icon && (
                                            <img 
                                                src={`data:image/jpeg;base64,${icon}`}
                                                alt={`${title} icon`} 
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center ml-6 -mt-3">
                                            <h6 className="flex flex-col text-white text-base font-bold">{creator_id}</h6>
                                            <h6 className="flex flex-col text-white text-base font-bold ml-2">{totalContributors !== 0 ? `+${totalContributors}` : ''}</h6>
                                            <h6 className="flex flex-col text-white text-base font-bold ml-4">{elapsedTime}</h6>
                                        </div>
                                        <h1 className="text-2xl font-bold text-white ml-6">{title}</h1>
                                        <h4 className="text-lg font-bold text-graygreen ml-6">{description}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                    className={`flex-1 overflow-y-auto mt-24 w-full h-3/4 relative overflow-auto ${
                        font === 0 ? 'istok-web-regular' : font === 1 ? 'tinos-regular' : 'playpen-sans-regular'
                    }`}
                >
                    <div className="flex flex-row my-10">
                        {filteredTopics.map((topic) => (
                            <div key={topic.topic_id} className="topic-section flex flex-col">
                                <div className="topic-card w-72 h-24 bg-white rounded-2xl m-6 p-6 relative flex items-center justify-between">
                                    <h2 className="text-xl font-bold self-start h-full flex items-center justify-start">
                                        {topic.text}
                                    </h2>
                                </div>
                                <div className="post-section ml-6 mt-3">
                                    {topic.posts && topic.posts.length > 0 ? (
                                        topic.posts.map((post) => (
                                            <div key={post.post_id} className="mb-4">
                                                <div
                                                    className="post-card flex flex-col p-3 border rounded-lg bg-gray-100 shadow w-72 h-fit mt-2 cursor-pointer"
                                                >
                                                    <h4 className="font-semibold">{post.post_head}</h4>
                                                    <p className="text-sm">{post.post_body}</p>
                                                </div>
                                                {expandedPosts[post.post_id] && (
                                                    <div className="comments-section ml-4 mt-2">
                                                        {post.comments.map((comment, index) => (
                                                            <div
                                                                key={index}
                                                                className="comment-card flex flex-col p-3 border rounded-lg bg-white shadow w-64 h-fit mt-2"
                                                            >
                                                                <p className="text-sm">{comment.comment_text}</p>
                                                                <div className="flex">
                                                                    <p className="flex-col m-1">{comment.comment_heart}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No posts yet for this topic.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default Preview; 