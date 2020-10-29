import * as types from './types';

export const logIn = user => ({
    type: types.LOG_IN,
    user: user
});

export const logOut = () => ({
    type: types.LOG_OUT
});