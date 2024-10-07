import client from './client'

const endpoint = '/group-profile'

const uploadGroupProfileImage = (groupId, profileImageUri) => {
    const formData = new FormData();
    
    formData.append('groupId', groupId);
    formData.append('profileImage', {
      uri: profileImageUri, 
      name: 'group-profile.jpg',  
      type: 'image/jpeg'    
    });
  
    return client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
};

export default {uploadGroupProfileImage};