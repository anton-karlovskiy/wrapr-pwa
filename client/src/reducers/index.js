import { combineReducers } from 'redux';
import authReducer from './authReducer';
import videoStepperReducer from './videoStepperReducer';
import loadingStatusReducer from './loadingStatusReducer';

export default combineReducers({
    auth: authReducer,
    videoStepper: videoStepperReducer,
    loadingStatus: loadingStatusReducer
});