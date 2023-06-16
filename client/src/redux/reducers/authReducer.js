import {CREATE_PROFILE, LOGGED_OUT} from "redux/types";
import {TOKEN_STORAGE_NAME} from "lib/constants";
import jwt_decode from "jwt-decode";
import {isEmpty} from "lodash";
import setAuthorizationToken from "../../lib/setAuthorizationToken";

const initState = {profile: {}, role: null, token: null}
const token = sessionStorage.getItem(TOKEN_STORAGE_NAME) ?
    sessionStorage.getItem(TOKEN_STORAGE_NAME) : null

if (token) {
    let currentDate = Math.round(new Date().getTime() / 1000);
    let decoded = jwt_decode(token)
    if (currentDate <= decoded.exp) {
        initState.token = token
        initState.profile = decoded
        initState.role = decoded.role ? decoded.role : "STUDENT"
    } else {
        sessionStorage.removeItem(TOKEN_STORAGE_NAME);
    }
}


initState.logged_in =
    !isEmpty(initState.profile) &&
    initState.role !== null &&
    initState.token !== null

if (initState.logged_in) setAuthorizationToken(initState.token)

const authReducer = (state = initState, {type, payload}) => {
    switch (type) {
        case CREATE_PROFILE :
            return ({
                logged_in: true,
                profile: payload.profile,
                token: payload.token,
                role: payload.role
            });


        case LOGGED_OUT:
            return ({
                logged_in: false,
                profile: {},
                token: null,
                role: null
            })
        default:
            return state;

    }

}
export default authReducer;

