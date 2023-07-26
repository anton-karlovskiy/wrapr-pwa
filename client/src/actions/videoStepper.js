
import * as TYPES from './types';
import config from '../config';

export const setBackgroundImage = backgroundImage => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_BACKGROUND_IMAGE,
        payload: backgroundImage
    });
};

export const setBackgroundSize = backgroundSize => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_BACKGROUND_SIZE,
        payload: backgroundSize
    });
};

export const setBackgroundColor = backgroundColor => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_BACKGROUND_COLOR,
        payload: backgroundColor
    });
};

export const setVideo = video => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: video
    });
};

export const addVideoDuration = duration => (dispatch, getState) => {
    const { videoStepper: { video } } = getState();
    const newVideo = {
        ...video,
        duration
    };
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: newVideo
    });
}

export const updateVideoSizePos = ({width, height, x, y}) => (dispatch, getState) => {
    const { videoStepper: { video, scale } } = getState();
    // store logical rendering size from physical size on canvas
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newVideo = {
        ...video,
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: newVideo
    });
};

export const addHeaderFooter = headerFooter => (dispatch, getState) => {
    const { videoStepper: { headerFooters } } = getState();
    if (headerFooters.length >= config.headerFooterCountLimit) {
        return false;
    }

    const payload = {
        clientId: Date.now(),
        ...headerFooter
    };
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_HEADERFOOTER,
        payload
    });
    return true;
};

export const removeHeaderFooter = clientId => (dispatch, getState) => {
    const { videoStepper: { headerFooters } } = getState();

    const targetIndex = headerFooters.findIndex(element => element.clientId === clientId);
    const newHeaderFooters = [...headerFooters];
    newHeaderFooters.splice(targetIndex, 1);

    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_HEADERFOOTERS,
        payload: newHeaderFooters
    });
};

export const updateHeaderFooterSizePos = clientId => (dispatch, getState) => ({width, height, x, y}) => {
    const { videoStepper: { headerFooters, scale } } = getState();
    
    const targetIndex = headerFooters.findIndex(element => element.clientId === clientId);
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newHeaderFooter = {
        ...headerFooters[targetIndex],
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    const newHeaderFooters = [...headerFooters];
    newHeaderFooters[targetIndex] = newHeaderFooter;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_HEADERFOOTERS,
        payload: newHeaderFooters
    });
};

export const addText = text => dispatch => {
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_TEXT,
        payload: text
    });
};

export const updateText = (newText, updateIndex) => (dispatch, getState) => {
    const { videoStepper: { texts } } = getState();

    const newTexts = [...texts];
    newTexts[updateIndex] = newText;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const removeText = removeIndex => (dispatch, getState) => {
    const { videoStepper: { texts } } = getState();

    const newTexts = [...texts];
    newTexts.splice(removeIndex, 1);
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const updateTextSizePos = clientId => (dispatch, getState) => ({width, height, x, y}) => {
    const { videoStepper: { texts, scale } } = getState();
    
    const targetIndex = texts.findIndex(element => element.clientId === clientId);
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newText = {
        ...texts[targetIndex],
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    const newTexts = [...texts];
    newTexts[targetIndex] = newText;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const addGifImage = gifImage => (dispatch, getState) => {
    const payload = {
        clientId: Date.now(),
        ...gifImage
    };
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_GIFIMAGE,
        payload
    });
};

export const removeGifImage = clientId => (dispatch, getState) => {
    const { videoStepper: { gifImages } } = getState();

    const targetIndex = gifImages.findIndex(element => element.clientId === clientId);
    const newGifImages = [...gifImages];
    newGifImages.splice(targetIndex, 1);

    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES,
        payload: newGifImages
    });
};

export const updateGifImageSizePos = clientId => (dispatch, getState) => ({width, height, x, y}) => {
    const { videoStepper: { gifImages, scale } } = getState();
    
    const targetIndex = gifImages.findIndex(element => element.clientId === clientId);
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newGifImage = {
        ...gifImages[targetIndex],
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    const newGifImages = [...gifImages];
    newGifImages[targetIndex] = newGifImage;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES,
        payload: newGifImages
    });
};

export const addSubtitle = subtitle => dispatch => {
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_SUBTITLE,
        payload: subtitle
    });
};

export const updateSubtitle = (newSubtitle, updateIndex) => (dispatch, getState) => {
    const { videoStepper: { subtitles } } = getState();

    const newSubtitles = [...subtitles];
    newSubtitles[updateIndex] = newSubtitle;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_SUBTITLES,
        payload: newSubtitles
    });
};

export const removeSubtitle = removeIndex => (dispatch, getState) => {
    const { videoStepper: { subtitles } } = getState();

    const newSubtitles = [...subtitles];
    newSubtitles.splice(removeIndex, 1);
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_SUBTITLES,
        payload: newSubtitles
    });
};

export const setScale = scale => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_SCALE,
        payload: scale
    });
};

export const clearData = () => dispatch => {
    dispatch({
        type: TYPES.CLEAR_VIDEOSTEPPER_DATA
    });
};
