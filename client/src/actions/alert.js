import uuid from "uuid/dist/v4"
import {SET_ALERT, REMOVE_ALERT} from "./types";



export const setAlert = (msg,clr,timeOut=3000) => (dispatch) =>{
    const id = uuid();
    dispatch({type:SET_ALERT, payload:{msg,clr,id}});
    setTimeout(()=>{dispatch({type:REMOVE_ALERT,payload:id})},timeOut);
}




