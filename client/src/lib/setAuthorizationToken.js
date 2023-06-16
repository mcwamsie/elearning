import AxiosInstance from "./AxiosInstance";

export default function setAuthorizationToken(token) {
    if (token) {
        AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }else{
        delete AxiosInstance.defaults.headers.common['Authorization'];
    }
}
