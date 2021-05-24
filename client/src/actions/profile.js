import {GET_PROFILE, ERROR_PROFILE} from "./types";
import { setAlert} from "./alert";
import axios from "axios"


export const getCurrentProfile = () => async dispatch =>{
    try {
       
        const res = await axios.get('/api/profile/me');
        dispatch({type:GET_PROFILE, payload:res.data});
        
    } catch (error) {
        dispatch({type:ERROR_PROFILE, payload:{msg:error.response.data.msg, status:error.response.status}});
    }
}


export const createProfile = (formData, history,edit=false) => async dispatch =>{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

        const res = await axios.post('/api/profile',formData, config);

        dispatch({type:GET_PROFILE,payload:res.data});
        dispatch(setAlert(edit ? 'Profile Updated': 'Profile Created','success'));
        if(!edit){
            history.push('/dashboard');
        }
    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg,"danger")));
        }
        dispatch({type:ERROR_PROFILE, payload:{msg:error.response.data.msg, status:error.response.status}});
    }

}