import client from './client';

const endpoint = '/profile';

const uploadProfileImage = (userId, profileImageUri) => {
    const formData = new FormData();
    
    formData.append('userId', userId);
    formData.append('profileImage', {
      uri: profileImageUri, 
      name: 'profile.jpg',  
      type: 'image/jpeg'    
    });
  
    return client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

export default {uploadProfileImage};