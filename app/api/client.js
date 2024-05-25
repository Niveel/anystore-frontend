import {create} from 'apisauce';
import authStorage from "../auth/storage";

const apiClient = create({
    baseURL: "https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api",
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