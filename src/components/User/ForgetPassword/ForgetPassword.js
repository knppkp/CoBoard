import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { fetchUsers, sendMail } from "../../../api";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [se, setSE] = useState([]);
  const [anonymous, setAnonymous] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchUsers();
        if (!response || typeof response !== 'object') {
          throw new Error("Invalid response from server");
        }
        console.log(response);
        setSE(response.se);
        setAnonymous(response.anonymous);
      } catch (error) {
        console.error("Failed to load users", error);
        setError("Failed to load users. " + (error.message || ''));
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
    setError(""); // Clear error when typing
    setSuccessMessage(""); // Clear success message when typing
  };

  const handleSendResetEmail = async () => {
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    const se_user = se.find((user) => user.sid === username);
    const a_user = anonymous.find((user) => user.aid === username);

    if (se_user) {
      try {
        const mailData = {
          receiver_email: `${se_user.sid}@kmitl.ac.th`,
          pw: se_user.spw,
        };
  
        // Wait for the email to be sent before setting the success message
        await sendMail(mailData);
        setSuccessMessage(`Password sent to the email linked with ${username}.`);
      } catch (error) {
        console.error("Failed to send recovery password", error);
        setError("Failed to send recovery email.");
      }
    } else if (a_user) {
      try {
        const mailData = {
          receiver_email: a_user.mail,
          pw: a_user.apw,
        };
  
        // Wait for the email to be sent before setting the success message
        await sendMail(mailData);
        setSuccessMessage(`Password sent to the email linked with ${username}.`);
      } catch (error) {
        console.error("Failed to send recovery password", error);
        setError("Failed to send recovery email.");
      }
    } else {
      setError("Username not found.");
    }
  };

  const handleBackToProfile = () => {
    navigate(-1); // Navigates to the previous page
  };
  

  return (
    <div>
      <div className="overflow-hidden m-0 h-screen relative">
      <div id="usernameInput" className="flex flex-col items-center mt-[130px]">
      <div className="w-[440px] h-[400px] bg-white rounded-[20px] shadow-[inset_0px_0px_10px_rgba(0,0,0,0.2)] flex flex-col justify-center items-center mb-[150px] relative">
      <div className="absolute top-[-110px]">
            <img
              src="/asset/keylock.png"
              alt="KeyLock"
              className="h-[210px] w-[390px]" 
            />
          </div>
          <div className="font-['Istok Web'] text-[30px] mt-[0px] mb-[5px] font-bold text-black">
            Forget Password
          </div>
          <div className="font-['Istok Web'] text-[15px] mb-[20px] font-normal text-black text-center">
            Enter your username, and we'll send<br />
            the password to your registered email.
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className="w-[320px] h-[45px] p-[10px] mb-2 border-2 border-[#a2a4a7] font-bold text-[18px] placeholder-[#acaeb1]"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

          <button
            className="w-[320px] h-[48px] mt-[20px] p-[10px] rounded-[15px] flex items-center justify-center bg-basegreen text-white font-bold text-[25px] tracking-[1px] hover:bg-basegreenhover"
            onClick={handleSendResetEmail}
          >
            Submit
          </button>
          <button
            className="mt-[20px] flex items-center justify-center text-gray-700 text-[15px] tracking-[1px] hover:text-gray-900 transition-all group"
            onClick={handleBackToProfile}
          >
            <span className="mr-2 transform transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
              {"<"}
            </span>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
    </div>

  );
};

export default ForgetPassword;
