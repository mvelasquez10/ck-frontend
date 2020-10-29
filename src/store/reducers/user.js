import * as types from '../actions/types';
import { setToken } from '../../services/CK';

const initialState = {
    user : null
};

const user = (state = initialState, action) => {
    switch(action.type) {
        case types.LOG_IN :
            localStorage.setItem('user', JSON.stringify(action.user));
            setToken(action.user.token);
            return {
                ...state,
                user : 
                { 
                    id : action.user.id, 
                    name: action.user.name, 
                    surname: action.user.surname, 
                    isAdmin : action.user.isAdmin 
                }
            }
        case types.LOG_OUT :
            localStorage.removeItem('user');
            setToken(null);
            return {
                ...state,
                user : {}
            }
        default:
            return state;
    }
};

export default user;