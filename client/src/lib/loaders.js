import { defer } from "react-router-dom"
import { apiRequest } from "./apiRequests";

export const singlePostLoader = async ({params}) => {
    const resposne = await apiRequest('/posts/' + params.id);
    return resposne.data;
}

export const postListLoader = async ({request}) => {
    const query = request.url.split("?")[1];
    const postPromise = apiRequest('/posts?' + query);

    return defer({
        postResponse: postPromise
    });
}

export const profilePageLoader = async () => {
    const postPromise = apiRequest('/users/profilePosts');
    const chatPromise = apiRequest('/chats');
    return defer({
        postResponse: postPromise,
        chatResponse: chatPromise
    });
}