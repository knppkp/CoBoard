import React, { useState } from 'react';

const SetSchedule = ({ isVisible, closeSchedule, publishDate, setPublish, expiredDate, setExpired }) => {

    const handleSetSchedule = () => {
        if (publishDate || expiredDate) {
            closeSchedule();
        } else {
            alert("Please select a date.");
        }
    };

    return (
        <>
            {isVisible && (
                <div id="schedule" className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-fit p-6 rounded-2xl shadow-lg relative">
                        <h1 className="text-center font-bold text-3xl m-2">Schedule Topic</h1>
                        <h5 className="text-left ml-5 text-sm m-5 -mb-3">Set publish date</h5>
                        <div className="flex justify-center m-4">
                            <input
                                type="date"
                                id="publishDate"
                                required
                                className="border-2 border-black p-2 rounded-md w-96 h-12 cursor-pointer"
                                value={publishDate}
                                onChange={(e) => setPublish(e.target.value)}  // Update the date state
                            />
                        </div>
                        <h5 className="text-left ml-5 text-sm m-2 -mb-3">Set deadline</h5>
                        <div className="flex justify-center m-4 mb-7">
                            <input
                                type="date"
                                id="expiredDate"
                                required
                                className="border-2 border-black p-2 rounded-md w-96 h-12 cursor-pointer" 
                                value={expiredDate}
                                onChange={(e) => setExpired(e.target.value)}  // Update the date state
                            />
                        </div>
                        <div className="flex justify-around">
                            <div className="flex flex-col">
                                <button onClick={closeSchedule} className="w-44 h-12 bg-lightgray hover:bg-lightergray text-black rounded-xl font-semibold text-xl">Cancel</button>
                            </div>
                            <div className="flex flex-col">
                                <button onClick={handleSetSchedule} className="w-44 h-12 bg-basegreen hover:bg-basegreenhover text-white rounded-xl font-semibold text-xl">Set date</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SetSchedule;
