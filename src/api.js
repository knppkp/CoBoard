import axios from 'axios';

const API_BASE_URL = "https://api.knppkp.me";

export const fetchForums = async (board) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coboard/${board}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching forums:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw new Error('Failed to fetch forums: ' + error.message);
  }
};

export const fetchTopics = async (board, forum_name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coboard/${board}/${forum_name}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics.');
  }
};

export const AddTopic = async (board, forum_name, topicData) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/coboard/${board}/${forum_name}/topic`, topicData);
      return response.data;
  } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
  }
};

export const createForum = async (board, forumData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/coboard/${board}/`, forumData);
    return response.data;
  } catch (error) {
    console.error('Error creating forum:', error);
    throw error;
  }
};

export const updateForum = async (board, forum_name, forumData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/coboard/${board}/${forum_name}/setting`, forumData);
    return response.data;
  } catch (error) {
    console.error("Error updating forum:", error.response?.data || error.message);
    throw error;
  }
};

export const createPost = async (board, forumName, topicId, postData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/coboard/${board}/${forumName}/post`,
      postData,
      {
        params: { topic_id: topicId }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updateLike = async (board, forum_name, itemId, itemType) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/coboard/${board}/${forum_name}/like`, {
      item_id: itemId,
      item_type: itemType
    });
    return response.data;
  } catch (error) {
    console.error('Error updating like:', error);
    throw new Error('Failed to update like.');
  }
};

export const addComment = async (board, forum_name, postId, commentText, sid, aid) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/coboard/${board}/${forum_name}/comment`,
      {
        comment_text: commentText,
        scomment_creator: sid,
        acomment_creator: aid,
      },
      {
        params: { post_id: postId },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment.');
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user.');
  }
};

export const addBookmark = async (board, forum_name, userID, userStatus) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/coboard/${board}/${forum_name}`, {
      user_id: userID,
      status: userStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error('Failed to fetch user.');
  }
};

export const deleteBookmark = async (board, forum_name, user_id, status) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/coboard/${board}/${forum_name}`, 
      {
        params: { status, user_id }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw error;
  }
};

export const deleteAccess = async (board, forum_name) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/coboard/${board}/${forum_name}/setting`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw error;
  }
};

export const createAccess = async (board, forum_name, userID) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/coboard/${board}/${forum_name}/setting`, null, {
      params: { user_id: userID }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating access:', error);
    throw new Error('Failed to create access.');
  }
};

export const deleteForum = async (forum_id, sid) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/user/${sid}/${forum_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting forum:", error);
    throw error;
  }
}

export const createAnonymousUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const uploadFile = async (fileData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/file`, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    console.log('File uploaded successfully:', response.data);
  } catch (error) {
      console.error('Error uploading file:', error);
  }
}

export const downloadFile = async (fileId) => {
  try {
      const response = await axios.get(`http://localhost:8000/file/${fileId}`, {
          responseType: 'blob'
      });
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded_file';
      
      // Try to get filename from Content-Disposition header
      if (contentDisposition) {
          // Check for RFC 5987 encoded filename
          const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/i);
          if (filenameMatch) {
              filename = decodeURIComponent(filenameMatch[1]);
          } else {
              // Fallback to regular filename
              const regularMatch = contentDisposition.match(/filename="(.+)"/i);
              if (regularMatch) {
                  filename = decodeURIComponent(regularMatch[1]);
              }
          }
      }
      
      // Create blob with proper type
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
  } catch (error) {
      console.error('Error downloading file:', error);
      console.error('Response headers:', error.response?.headers);
  }
};

export const sendMail = async (mailData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sendmail`, mailData);
    return response.data;
  } catch (error) {
    console.error('Error sendmail:', error);
    throw error;
  }
}

export const fetchUserData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetch user:', error);
    throw error;
  }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating forum:", error.response?.data || error.message);
    throw error;
  }
};

