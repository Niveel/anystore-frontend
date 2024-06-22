import client from "./client";

const endpoint = "/report";

const reportMsg = (reporterEmail, reporterName, reporteeName, targetMessage) => client.post(endpoint, { 
    reporterEmail, 
    reporterName, 
    reporteeName, 
    targetMessage 
});

export default {reportMsg};