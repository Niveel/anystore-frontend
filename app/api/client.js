import {create} from 'apisauce';
import authStorage from "../auth/storage";

const apiClient = create({
    baseURL: "http://shopwit.eba-g43qxnjk.us-west-2.elasticbeanstalk.com/api",
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