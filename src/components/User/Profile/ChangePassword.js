import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const ChangePassword = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordUpdate,
  handleCancelChangePassword,
  error,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();


  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="mt-6 ml-4">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row gap-5 -ml-5 md:ml-10 items-center">
        <div className="flex-auto text-black text-2xl md:text-4xl font-bold">
          Change my password
        </div>
        <div className="hidden md:block bg-gray-400 mr-[150px] h-[3px] w-[645px]" />
      </div>
      
      {/* Password Form */}
      <div className="w-full md:w-[1050px] mt-7 -ml-2 md:ml-10 mx-auto bg-gray-200 rounded-lg shadow-md p-4 md:p-6">
        <div className="mb-4">
          <p className="text-gray-700 text-lg md:text-xl">Current password</p>
          <input
            type="text"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="text-gray-700 mb-5 text-lg md:text-2xl w-full md:w-[500px] border border-gray-300 rounded p-2"
          />
                      
                      <p
  className="relative text-blue-600 text-[9px] md:text-[10px] mt-[-15px] ml-[230px] md:ml-[415px] md:-mt-5 cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-[70px] md:hover:after:w-[80px]"
  onClick={() => navigate(`/user/forget_password`)}
>
  Forget password?
</p>

        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-lg md:text-xl">New password</p>
          <div className="relative w-full md:w-[500px]">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-gray-700 mb-5 text-lg md:text-2xl w-full border border-gray-300 rounded p-2"
            />
            
            <button
              onClick={toggleShowNewPassword}
              className="absolute right-4 top-1/3 transform -translate-y-1/2"
              type="button"
            >
              <img
                src={showNewPassword ? '/asset/opened_eye.svg' : '/asset/closed_eye.svg'}
                alt={showNewPassword ? "Hide Password" : "Show Password"}
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-lg md:text-xl">Confirm new password</p>
          <div className="relative w-full md:w-[500px]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="text-gray-700 mb-5 text-lg md:text-2xl w-full border border-gray-300 rounded p-2"
            />
            <button
              onClick={toggleShowConfirmPassword}
              className="absolute right-4 top-1/3 transform -translate-y-1/2"
              type="button"
            >
              <img
                src={showConfirmPassword ? '/asset/opened_eye.svg' : '/asset/closed_eye.svg'}
                alt={showConfirmPassword ? "Hide Password" : "Show Password"}
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Button Container */}
      <div className="mt-4 flex justify-center md:justify-start md:ml-[800px] gap-4">
        <button
          onClick={handlePasswordUpdate}
          className="bg-lightergreen text-basegreen py-2 px-6 md:px-10 rounded-xl hover:bg-lightergreenhover"
        >
          Update
        </button>
        <button
          onClick={handleCancelChangePassword}
          className="bg-gray-400 text-white py-2 px-6 md:px-10 rounded-xl hover:bg-gray-500"
        >
          Cancel
          
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;