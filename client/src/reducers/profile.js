import {GET_PROFILE, ERROR_PROFILE, CLEAR_PROFILE} from "../actions/types";
const initialState = {
    profile:null,
    profiles:[],
    repos:[],
    error:{},
    loading:true
}



export default function profile(state=initialState, action) {
    const {payload, type} = action;
    switch(type){
        case GET_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            }
        case ERROR_PROFILE:
            return {
                ...state,
                error:payload,
                loading:false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            }
        default:
            return state;
    }
}