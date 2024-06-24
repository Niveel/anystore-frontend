import client from "./client";

const endpoint = "/groups/exit-member";

const reportGroup = (groupId, memberId) => client.post(endpoint, {groupId, memberId});

export default {reportGroup};