import React from 'react';

const Preview = ({ title, description, tags, allow, onClose, onJoin, previewUrl }) => {
    return (
        <div id="preview" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
            <div className="bg-white w-fit max-w-4xl p-4 md:p-6 rounded-2xl shadow-lg relative">
                <div className="flex flex-row justify-between items-center mb-4 md:mb-6">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-md bg-gray-200"
                    >
                        <img src="/asset/close.svg" alt="Close" className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <div>
                        <button 
                            type="button" 
                            onClick={onJoin} 
                            disabled={!allow}
                            className={`w-40 md:w-56 h-12 md:h-16 rounded-md text-[16px] md:text-xl font-semibold ${
                                allow ? 'bg-green-200 text-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Join Now
                        </button> 
                    </div>
                </div>
                <div className="w-full h-56 md:w-[630px] md:h-80 bg-gray-200 flex items-center justify-center mb-4">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full"
                        title="App Preview"
                        frameBorder="0"
                    />
                </div>
                <div className="text-left">
                    <h1 className="text-lg md:text-xl font-bold mb-1">{title}</h1>
                    <p className="text-gray-600 text-xs md:text-sm">{description}</p>
                </div>                
                {tags && tags.length > 0 && (
                    <div className="flex flex-row flex-wrap mt-4">
                        {tags.map(tag => (
                            <div 
                                key={tag.tag_id} 
                                className="flex flex-col bg-lightgreen w-fit h-8 md:h-11 m-1 md:m-2 p-2 rounded-md items-center justify-center"
                            >
                                <p className="font-bold text-xs md:text-base p-0 md:p-1 text-white">{tag.tag_text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;
