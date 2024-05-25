import client from './client';

const login = (email, password, username) => client.post('/login', { email, password, username});


export default {login};