import {LOGOUT, REGISTER_SUCCESS,REGISTER_FAIL, USER_LOADED, AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL, CLEAR_PROFILE} from "./types";
import {setAlert} from "./alert";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch =>{
    
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        const res = await axios.get('/api/auth');
        dispatch({type:USER_LOADED, payload:res.data});

    }catch(error){
        dispatch({type: AUTH_ERROR});
    }

}

export const register = ({name, email, password}) => async dispatch =>{

    const body = JSON.stringify({name, email, password});
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
    const res = await axios.post('/api/users', body,config);
    dispatch({type:REGISTER_SUCCESS,payload:res.data});
    dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,"danger")));
        }
        dispatch({type:REGISTER_FAIL});
        
    }
}



export const login = (email, password) => async dispatch =>{

    const body = JSON.stringify({email, password});
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
    const res = await axios.post('/api/auth', body,config);
    dispatch({type:LOGIN_SUCCESS,payload:res.data});
    dispatch(loadUser());

    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,"danger")));
        }
        dispatch({type:LOGIN_FAIL});
        
    }
}


export const logout = ()=> dispatch =>{

    dispatch({type:LOGOUT});
    dispatch({type:CLEAR_PROFILE});
}