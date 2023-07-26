
import { SET_LOADING_STATUS } from './types';

export const setLoadingStatus = loadingStatus => dispatch => {
    dispatch({
        type: SET_LOADING_STATUS,
        payload: loadingStatus
    });
};