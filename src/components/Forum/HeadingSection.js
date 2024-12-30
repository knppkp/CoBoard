import React, { useState, useEffect } from 'react';

const HeadingSection = React.forwardRef(({ setTitle, setDescription, setIcon, title, description, icon }, ref) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (icon) {
      setPreview(`data:image/jpeg;base64,${icon}`);
    }
  }, [icon]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setIcon(base64String);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div ref={ref} className="p-2">
      <h1 className="text-white font-bold  text-2xl pl-5 -mb-3">Heading</h1>
      <div className="w-490 md:w-500 h-fit bg-lightorange mt-4 rounded-2xl py-4 px-10 flex flex-col items-center">
        <h2 className="text-xl self-start m-1 font-bold text-blackorange">Title</h2>
        <input
          className="bg-white w-380 md:w-430 h-10 m-1 rounded-2xl px-3 cursor-pointer"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={title}
        />
        <div className="my-4 flex justify-center">
          <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
        </div>
        <h2 className="text-xl self-start m-1 font-bold text-blackorange">Description</h2>
        <input
          className="bg-white w-380 md:w-430 h-10 m-1 rounded-2xl px-2 cursor-pointer"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={description}
        />
        <div className="my-4 flex justify-center">
          <div className="w-380 md:w-430 h-0.5 bg-darkorange"></div>
        </div>

        {/* Icon Upload Section */}
        <div className="justify-between flex w-full">
          <h2 className="text-xl self-start m-1 mt-5 font-bold text-blackorange">Icon</h2>
          <div className="flex flex-row items-center space-x-2">
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="bg-graybg w-16 h-16 rounded-full mr-4 flex justify-center items-center">
                {preview ? (
                  <img src={preview} alt="Icon Preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-500">Upload</span>
                )}
              </div>
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default HeadingSection;
