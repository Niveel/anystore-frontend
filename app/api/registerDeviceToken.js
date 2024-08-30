import client from './client';

const registerDeviceToken = (authToken, username, deviceId) => client.post('/add-device-id', { username, deviceId}, {
    headers: {
        'x-token': authToken,
    }
});

export default registerDeviceToken;