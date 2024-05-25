import client from './client';

const resetPassword = (email, password) => client.post('/reset', { email, password });
const generateResetCode = (email) => client.post('/generate-reset-code', { email });

export default { resetPassword, generateResetCode };
