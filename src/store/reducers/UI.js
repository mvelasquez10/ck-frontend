

import * as types from '../actions/types';

const initialState = {
    confirmAction: {
        show: false,
        message: null,
        confirm: null,
    }
};

const confirmAction = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOW_CONFIRM_ACTION:
        case types.CLOSE_CONFIRM_ACTION:
            return {
                ...state,
                confirmAction: action.confirmAction
            }
        default:
            return state;
    }
};

export default confirmAction;