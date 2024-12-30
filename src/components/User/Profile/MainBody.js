import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import ChangePassword from "./ChangePassword";
import { UserContext } from '../../../UserContext';
import { fetchUsers, updateUser } from "../../../api";

const MainBody = () => {
  const { user, status, setUser, setStatus } = useContext(UserContext);
  const id = status === "se" ? user.sid : user.aid;
  const [userData, setUserData] = useState({
    studentId: status === "se" ? user.sid : "",
    username: status === "se" ? user.username : user.aid,
    password: status === "se" ? user.spw : user.apw,
    profileImage: status === "se" ? user.sprofile : user.aprofile,
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anonymous, setAnonymous] = useState([]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editedUsername, setEditedUsername] = useState(userData.username);
  const [image, setImage] = useState(userData.profileImage);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchUsers();
        if (!response || typeof response !== 'object') {
          throw new Error("Invalid response from server");
        }
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

  
  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false);
  };

  const handlePasswordUpdate = async () => {
    // Input validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
  
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setUserData((prevData) => ({
      ...prevData,
      password: newPassword,
    }));
  
    try {
      const updatedUser = await updateUser(id, userData);
      setUser(updatedUser);
      // Close the edit view and return to profile view
      setIsEditing(false);
    } catch (error) {
        console.error('Error updating user:', error.response?.data || error.message);
        alert('Error updating user. Please try again.');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedUsername(userData.username);
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Cancel editing and return to view mode
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        setUserData((prevData) => ({
          ...prevData,
          profileImage: base64Image,
        }));
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle updating username and closing the edit view
  const handleUpdateUsername = async () => {
    if (editedUsername.length > 10) {
      alert("Username cannot exceed 10 characters.");
      return;
    }
     if (anonymous.find((user) => user.aid === editedUsername) && status === "a") {
      alert("Username exist");
      return;
    }

    // Update userData state with edited username
    setUserData((prevData) => ({
      ...prevData,
      username: editedUsername,
    }));

    try {
      const updatedUser = await updateUser(id, userData);
      setUser(updatedUser);
      // Close the edit view and return to profile view
      setIsEditing(false);
    } catch (error) {
        console.error('Error updating user:', error.response?.data || error.message);
        alert('Error updating user. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-6">
      {isChangingPassword ? (
        <ChangePassword
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handlePasswordUpdate={handlePasswordUpdate}
          handleCancelChangePassword={handleCancelChangePassword} 
          error={error}
        />
      ) : isEditing ? (
        <ProfileEdit
          editedUsername={editedUsername}
          setEditedUsername={setEditedUsername}
          handleUpdateUsername={handleUpdateUsername}
          handleCancelEdit={handleCancelEdit} 
          error={error}
          image={image}
          setImage={setImage}
          handleImageUpload={handleImageUpload}
          userData={userData}
        />
      ) : (
        <ProfileView
          userData={userData}
          handleChangePassword={handleChangePassword}
          handleEditProfile={handleEditProfile}
          image={image}
        />
      )}
    </div>
  );
};

export default MainBody;
