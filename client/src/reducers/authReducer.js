
import * as TYPES from '../actions/types';
import { isEmpty } from '../utils/utility';

const initialState = {
    // TODO: not used for now but it is useful when we need to detect authentication in components without accessing to local storage
    isAuthenticated: false,
    user: null,
    errors: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TYPES.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case TYPES.GET_AUTH_ERRORS:
            return {
                ...state,
                errors: action.payload
            };
        case TYPES.CLEAR_AUTH_ERRORS:
            return {
                ...state,
                errors: null
            }
        default: 
            return state;
    }
};
