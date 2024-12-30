import React from "react";

const ProfileEdit = ({
  editedUsername,
  setEditedUsername,
  handleUpdateUsername,
  handleCancelEdit,
  error,
  image,
  setImage,
  handleImageUpload,
  userData,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        setImage(base64String);
      };
      reader.readAsDataURL(file);
      handleImageUpload(e);
    }
  };
  // Generate asterisks based on password length
  const generateAsterisks = (password) => {
    return password ? "*".repeat(password.length) : "";
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row items-center mb-4 md:ml-10">
        <div className="block md:hidden mb-4">
          <p className="text-black text-2xl md:text-4xl">Editing Profile</p>
        </div>

        <div className="bg-gray-300 rounded-full h-[150px] w-[150px] md:h-[234px] md:w-[234px] overflow-hidden relative">
          {image ? (
            <img
              src={`data:image/png;base64,${image}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : userData.sprofile ? (
            <img
              src={`data:image/png;base64,${userData.sprofile}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex items-center justify-center h-full text-gray-500">
              No Image
            </span>
          )}
        </div>

        {/* Image upload input */}
        <div className="mt-4 md:mt-0 mb-[50px] md:mb-[150px] md:ml-[-50px] z-40">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="bg-white rounded-full h-10 w-10 md:h-14 md:w-14 flex items-center justify-center shadow-md hover:border-2 hover:border-gray-300 hover:bg-gray-200 transition duration-200">
              <img
                src="/asset/pencil.svg"
                alt="Upload"
                className="h-5 w-5 md:h-6 md:w-6"
              />
            </div>
          </label>
        </div>

        <div className="hidden md:flex flex-col md:flex-row items-center mt-4 md:mt-0">
          <div className="w-[650px] h-[3px] bg-gray-400 mb-[100px]"></div>
          <p className="text-black text-4xl ml-4 mb-[100px]">Editing Profile</p>
        </div>
      </div>

      {/* User information section */}
      <div className="w-[300px] md:w-[900px] mt-[-50px] md:mt-[-150px] mx-auto md:ml-[300px] bg-gray-200 rounded-lg shadow-md p-4 md:p-6">
        <p className="text-gray-700 mb-5 text-lg md:text-2xl">
          Student ID:<span className="ml-2 md:ml-6">{userData.studentId}</span>
        </p>
        <p className="text-gray-700 mb-5 text-lg md:text-2xl flex items-center">
          Username:
          <span className="ml-2 md:ml-4">
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded w-3/4 md:w-auto cursor-pointer"
            />
          </span>
        </p>
        {error && <p className="ml-2 md:ml-[130px] text-red-500">{error}</p>}
        <p className="text-gray-700 text-lg md:text-2xl">
          Password:
          <span className="ml-2 md:ml-8">
            {generateAsterisks(userData.password)}
          </span>
        </p>
      </div>

      {/* Button container */}
      <div className="mt-4 flex justify-center md:justify-start md:ml-[900px] gap-4">
        <button
          onClick={handleUpdateUsername}
          className="bg-lightergreen text-basegreen py-2 px-4 md:px-10 rounded-xl hover:bg-lightergreenhover"
        >
          Update
        </button>
        <button
          onClick={handleCancelEdit}
          className="bg-gray-400 text-white py-2 px-4 md:px-10 rounded-xl hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
