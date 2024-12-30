import React from "react";

const ProfileView = ({
  userData,
  handleChangePassword,
  handleEditProfile,
  image,
  isPasswordVisible,
}) => {
  // Generate asterisks based on password length
  const generateAsterisks = (password) => {
    return password ? "*".repeat(password.length) : "";
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col-reverse md:flex-row items-center mb-4 md:ml-10">
        {/* Profile image */}
        <div className="bg-gray-300 rounded-full h-[150px] w-[150px] md:h-[234px] md:w-[234px] overflow-hidden relative">
          {image ? (
            <img
            src={`data:image/jpeg;base64,${image}`}
            alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <span className="flex items-center justify-center h-full text-gray-500">
              No Image
            </span>
          )}
        </div>

        {/* Username text */}
        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0">
          <div className="hidden md:block w-full md:w-[700px] h-[3px] bg-gray-400 mb-4 md:mb-[100px]"></div>
          <p className="text-gray-700 text-2xl md:text-4xl ml-0 md:ml-4 mb-10 md:mb-[100px]">
            {userData.username ? userData.username : userData.studentId}
          </p>
        </div>
      </div>

      {/* User Information */}
      <div className="w-[300px] md:w-[900px] mt-[0px] md:mt-[-150px] mx-auto md:ml-[300px] bg-gray-200 rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-5 text-xl md:text-2xl">
          Student ID:<span className="ml-2 md:ml-7">{userData.studentId}</span>
        </p>
        <p className="text-gray-700 mb-5 text-xl md:text-2xl">
          Username:
          <span className="ml-4 md:ml-9">
            {userData.username ? userData.username : "-"}
          </span>
        </p>
        <p className="text-gray-700 text-xl md:text-2xl">
          Password:
          <span className="ml-5 md:ml-10">
            {isPasswordVisible
              ? userData.password
              : generateAsterisks(userData.password)}
          </span>
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-center md:justify-start md:ml-[900px] gap-4">
        <button
          onClick={handleEditProfile}
          className="bg-lightergreen text-basegreen py-2 px-4 rounded-xl hover:bg-lightergreenhover"
        >
          Edit Profile
        </button>
        <button
          onClick={handleChangePassword}
          className="bg-lightergreen text-basegreen py-2 px-4 rounded-xl hover:bg-lightergreenhover"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
