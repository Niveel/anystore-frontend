import {create} from 'apisauce';

const clientApi = create({
    baseURL: "https://imprezbookkeeping.pythonanywhere.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default clientApi;