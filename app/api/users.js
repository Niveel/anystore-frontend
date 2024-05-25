import client from './client';

const register = (userInfo) => client.post('/signup', userInfo);
const verifyCode = (code,email) => client.post('/verify-code', {code, email});

export default {register, verifyCode};  