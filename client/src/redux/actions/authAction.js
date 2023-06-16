import jwt_decode from "jwt-decode";
import {CREATE_PROFILE, LOGGED_OUT} from "../types";


export function setLoginUser(token){
    let decoded = jwt_decode(token)
    let profile = decoded
    let role = decoded.role ? decoded.role : "STUDENT"

    return {
        type : CREATE_PROFILE,
        payload: {profile, token, role}
    }
}


export function setLogout(){
    sessionStorage.clear()
    return {
        type: LOGGED_OUT,
        payload: {}
    }
}
