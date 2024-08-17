import {create} from 'apisauce';
import authStorage from "../auth/storage";
import settings from '../config/settings';

const apiClient = create({
    baseURL: settings.apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.addAsyncRequestTransform(async (request) => {
    const authToken = await authStorage.getToken();
    if(!authToken) return;
    request.headers["x-token"] = authToken;
}
);

export default apiClient;