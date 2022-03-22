
import { GET_USERS_ERROR, GET_USERS_SUCCESS } from '../constants/home';
const data = localStorage.getItem('users')
const storageUsers = JSON.parse(data ? data : '[]');
console.log(storageUsers)
const initialState = {
    users: storageUsers,
    userError: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default ( state = initialState, action:any) => {
    switch (action.type) {
     case GET_USERS_SUCCESS:
      return {
          ...state,
          users: action.payload,
      }
      case GET_USERS_ERROR:
      return {
          ...state,
          users: [],
          userError: action.payload,
      }

     default:
      return state
    }
   }