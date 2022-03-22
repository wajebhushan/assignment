import { GET_USERS_ERROR, GET_USERS_SUCCESS } from '../constants/home';
import axios from "axios";
   
export const onGetAllUsers = () => (dispatch: (arg: { type: string; payload: any; }) => void) => {
    axios.get('https://reqres.in/api/users?page=0&size=2')
    .then(function (response) {
      // handle success
      //console.log(response.data);
    
      if ( response.data) {
          console.log(response.data)
        localStorage.setItem("users",JSON.stringify(response.data));
        dispatch({
            type: GET_USERS_SUCCESS,
            payload:response.data,
        });
    } else {
        dispatch({
            type: GET_USERS_ERROR,
            payload: response
        });
    }
    })
    .catch(function (error) {
      console.log(error);
      dispatch({
        type: GET_USERS_ERROR,
        payload: error
    });
    })   
   }


