import client from './client2'

const flagMessage = (text) => client.get(`/analyze-text/?message=${text}`);

export default {flagMessage};