import {LOGOUT, LOGIN_FAIL,LOGIN_SUCCESS, AUTH_ERROR, REGISTER_FAIL,REGISTER_SUCCESS, USER_LOADED} from "../actions/types";

const initialState = {
    loading:true,
    user:null,
    token:localStorage.getItem('token'),
    isAuthenticated:null
}

export default function auth(state=initialState, action) {
    const {type, payload} =action;

    switch (type){
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload
            };

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token',payload.token)
            return {
                ...state,
                loading:false,
                ...payload,
                isAuthenticated:true
            };

        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token:null,
                loading:false,
                isAuthenticated:false,
                user:null
            }
            
        default:
            return state;
    }

    
}