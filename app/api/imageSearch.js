import client from "./client2";

const endpoint = "/image-search/";

const uploadImageToSearch = (imageUri) => {
    const formData = new FormData();
    
    formData.append('image', {
      uri: imageUri, 
      name: 'image.jpg',  
      type: 'image/jpeg'    
    });
  
    return client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
}

export default { uploadImageToSearch };