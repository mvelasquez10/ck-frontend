import * as types from './types';

export const showConfirmAction = (message, confirm) => ({
    type: types.SHOW_CONFIRM_ACTION,
    confirmAction : {
        show : true,
        message : message,
        confirm : confirm,
    }
});

export const closeConfirmAction = () => ({
    type: types.CLOSE_CONFIRM_ACTION,
    confirmAction : {
        show : false,
        message : null,
        confirm : null,
    }
});