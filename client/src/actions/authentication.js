
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import urlJoin from 'url-join';

import {
    loginPrefix,
    registerPrefix,
    forgotPasswordPrefix,
    checkResetPasswordPrefix,
    resetPasswordPrefix,
    currentUserPrefix
} from '../utils/api';
import { jwtTokenKey, pageLinks } from '../utils/links';
import * as TYPES from './types';
import setAuthToken from '../security/setAuthToken';
import config from '../config';

export const registerUser = (user, history) => dispatch => {
    clearAuthErrors()(dispatch);
    axios.post(urlJoin(config.proxyUrl, registerPrefix), user)
        .then(response => {
            history.push(pageLinks.Login.url);
        })
        .catch(error => {
            authErrorsHandler(error)(dispatch);
        });
};

export const loginUser = (user, history) => dispatch => {
    clearAuthErrors()(dispatch);
    axios.post(urlJoin(config.proxyUrl, loginPrefix), user)
        .then(response => {
            const { token } = response.data;
            localStorage.setItem(jwtTokenKey, token);
            setAuthToken(token);
            // TODO: api key should be used for decoding
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));

            history.push(pageLinks.WrapperList.url);
        })
        .catch(error => {
            authErrorsHandler(error)(dispatch);
        });
};

export const setCurrentUser = decoded => {
    return {
        type: TYPES.SET_CURRENT_USER,
        payload: decoded
    }
};

export const getCurrentUser = decoded => dispatch => {
    axios.get(urlJoin(config.proxyUrl, currentUserPrefix))
        .then(response => {
            const { user } = response.data;
            dispatch(setCurrentUser(user));
        })
        .catch(error => {
            console.log('ray : [authentication action getCurrentUser] error => ', error);
            dispatch(setCurrentUser(decoded));
        });
};

export const logoutUser = history => dispatch => {
    localStorage.removeItem(jwtTokenKey);
    setAuthToken(false);
    dispatch(setCurrentUser(null));

    if (history) {
        history.replace(pageLinks.Login.url);
    }
};

export const sendResetEmail = (data, successCallback, errorCallback) => dispatch => {
    clearAuthErrors()(dispatch);
    axios.post(urlJoin(config.proxyUrl, forgotPasswordPrefix), data)
        .then(successCallback)
        .catch(error => {
            authErrorsHandler(error)(dispatch);
            errorCallback && errorCallback(error);
        });
    };

export const clearAuthErrors = () => dispatch => {
    dispatch({
        type: TYPES.CLEAR_AUTH_ERRORS
    });
};

export const authErrorsHandler = error => dispatch => {
    if (error.response && error.response.data) {
        dispatch({
            type: TYPES.GET_AUTH_ERRORS,
            payload: error.response.data
        });
    } else {
        console.log('ray : [action authentication authErrorsHandler] something went wrong ', error.response);
    }
};

export const resetPassword = (data, successCallback, errorCallback) => dispatch => {
    axios.put(urlJoin(config.proxyUrl, resetPasswordPrefix), data)
        .then(successCallback)
        .catch(errorCallback);
};

export const checkResetPassword = (resetPasswordToken, successCallback, errorCallback) => dispatch => {
    axios.get(urlJoin(config.proxyUrl, checkResetPasswordPrefix), {
        params: { resetPasswordToken }
    })
        .then(successCallback)
        .catch(errorCallback);
};
