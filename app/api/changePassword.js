import client from './client';
import authStorage from '../auth/storage';

const resetPassword = (authToken,oldPassword, newPassword) => client.post('/change-password', { oldPassword, newPassword}, {
    headers: {
        'x-token': authToken,
    }
});

export default {resetPassword};