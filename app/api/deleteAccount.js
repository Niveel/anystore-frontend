import client from './client';

const deleteAccount = (email, token) => client.post('/delete-account',{email}, {
    headers: {
        'x-token': token,
    }
}); 

export default {deleteAccount};