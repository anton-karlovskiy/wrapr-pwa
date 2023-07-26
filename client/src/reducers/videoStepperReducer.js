
import config from '../config';
import * as TYPES from '../actions/types';

const initialState = {
    backgroundImage: null,
    backgroundSize: config.initialBackgroundSize,
    backgroundColor: null,
    video: null,
    headerFooters: [],
    texts: [],
    gifImages: [],
    subtitles: [],
    scale: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case TYPES.SET_VIDEOSTEPPER_BACKGROUND_IMAGE:
            return {
                ...state,
                backgroundImage: action.payload
            };
        case TYPES.SET_VIDEOSTEPPER_BACKGROUND_SIZE:
            return {
                ...state,
                backgroundSize: action.payload
            };
        case TYPES.SET_VIDEOSTEPPER_BACKGROUND_COLOR:
            return {
                ...state,
                backgroundColor: action.payload
            };
        case TYPES.SET_VIDEOSTEPPER_VIDEO:
            return {
                ...state,
                video: action.payload
            };
        case TYPES.ADD_VIDEOSTEPPER_HEADERFOOTER:
            return {
                ...state,
                headerFooters: [...state.headerFooters, action.payload]
            };
        case TYPES.UPDATE_VIDEOSTEPPER_HEADERFOOTERS:
            return {
                ...state,
                headerFooters: action.payload
            };
        case TYPES.ADD_VIDEOSTEPPER_TEXT:
            return {
                ...state,
                texts: [...state.texts, action.payload]
            };
        case TYPES.UPDATE_VIDEOSTEPPER_TEXTS:
            return {
                ...state,
                texts: action.payload
            };
        case TYPES.ADD_VIDEOSTEPPER_GIFIMAGE:
            return {
                ...state,
                gifImages: [...state.gifImages, action.payload]
            };
        case TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES:
            return {
                ...state,
                gifImages: action.payload
            };
        case TYPES.ADD_VIDEOSTEPPER_SUBTITLE:
            return {
                ...state,
                subtitles: [...state.subtitles, action.payload]
            };
        case TYPES.UPDATE_VIDEOSTEPPER_SUBTITLES:
            return {
                ...state,
                subtitles: action.payload
            };
        case TYPES.SET_VIDEOSTEPPER_SCALE:
            return {
                ...state,
                scale: action.payload
            };
        case TYPES.CLEAR_VIDEOSTEPPER_DATA:
            return {
                ...state,
                ...initialState
            };
        default: 
            return state;
    }
};
