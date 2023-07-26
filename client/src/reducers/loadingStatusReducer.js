
import * as TYPES from '../actions/types';

const initialState = {
    loadingStatusParams: {
        loading: false,
        text: 'Please wait...'
    }
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TYPES.SET_LOADING_STATUS:
            return {
                ...state,
                loadingStatusParams: action.payload,
            };
        default:
            return state;
    }
};
