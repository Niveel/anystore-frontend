import client from "./client";

const endpoint = "/stores/?search=product";

const getItems = () => client.get(endpoint);

export default {
    getItems,
    };

