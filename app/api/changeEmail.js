import client from './client';

const chancgeEmail = (authToken, newEmail) => client.post('/change-email', { newEmail }, {
    headers: {
        'x-token': authToken,
    }
});

export default changeEmail; 