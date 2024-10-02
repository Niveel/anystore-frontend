import client from './client';

const endpoint = 'group/messages/'

const fetchMessages = (groupId) => client.get(`${endpoint}?groupId=${groupId}`);

export default {fetchMessages};