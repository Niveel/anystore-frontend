import client from "./client";

const endpoint = "/report";

const reportMsg = (reporterName, reporterEmail, reporteeName, targetMessage) => client.post(endpoint, { 
                                                                                                    reporterName, 
                                                                                                    reporterEmail, 
                                                                                                    reporteeName, 
                                                                                                    targetMessage 
                                                                                                });

export default {reportMsg};