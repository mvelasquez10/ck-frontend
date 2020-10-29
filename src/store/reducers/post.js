import * as types from '../actions/types';

const initialState = {
    resetPost : false
};

const post = (state = initialState, action) => {
    switch(action.type) {
        case types.RESET_POSTS :
            return {
                ...state,
                resetPost : action.resetPost
            }
        default:
            return state;
    }
}

export default post;