import client from "./client";

const endpoint = "/delete-message";

const deleteMsgs = (messageIds) => client.post(endpoint, {messageIds});

export default { deleteMsgs };