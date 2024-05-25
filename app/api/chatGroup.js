import client from './client';

const createGroup = (groupName, creatorId) => client.post("/groups", {groupName, creatorId});

export default {createGroup};