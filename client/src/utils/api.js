
import urlJoin from 'url-join';
import axios from 'axios';
import FileSaver from 'file-saver';

import config from '../config';
import { uploadAccessType, jwtTokenKey } from './links';
import { convertDurationString } from './utility';
// TODO: using dispatch outside of components not recommended way 
import store from '../store';
import { setLoadingStatus } from '../actions/loadingStatus'

const filesPrefix = 'api/files';
const uploadPrefix = 'api/upload';
const uploadTypePrefix = 'type=';
const renderingPrefix = 'api/render';
const loginPrefix = 'api/login';
const registerPrefix = 'api/register';
const forgotPasswordPrefix = 'api/forgot-password';
const checkResetPasswordPrefix = 'api/check-reset-password';
const resetPasswordPrefix = 'api/reset-password';
const stripeProductPlansPrefix = 'api/stripe-product-plans';
const stripeSubscribePrefix = 'api/stripe-subscribe';
const currentUserPrefix = 'api/me';
const stripeCancelSubscriptionPrefix = 'api/stripe-cancel-subscription';
const stripeChangeSubscriptionPrefix = 'api/stripe-change-subscription'
const UploadAccessTypePrefix = 'public=';

const getUploadedUrl = (type, accessType=uploadAccessType.private) => {
    const uploadedUrl = urlJoin(config.proxyUrl, filesPrefix, `?${uploadTypePrefix}${type}`, `&${UploadAccessTypePrefix}${accessType}`);
    return uploadedUrl;
};

const getUploadUrl = (type, accessType=uploadAccessType.private) => {
    const uploadUrl = urlJoin(config.proxyUrl, uploadPrefix, `?${uploadTypePrefix}${type}`, `&${UploadAccessTypePrefix}${accessType}`);
    return uploadUrl;
};

const getFileRestUrl = _id => {
    const fileRestUrl = urlJoin(config.proxyUrl, filesPrefix, _id);
    return fileRestUrl;
};

const getRenderingUrl = renderStep => {
    const renderingUrl = urlJoin(config.proxyUrl, renderingPrefix, renderStep);
    return renderingUrl;
}

const apiUnauthorizedHandler = errorResponseStatus => {
    switch(errorResponseStatus) {
        case 401:
            // once refreshing token expiration logic will handle it in APP component when 401 
            window.location.reload();
            break;
        default:
            break;
    }
};

const getHeaders = () => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        // TODO: store jwt token to redux state and rehydrate
        Authorization: localStorage.getItem(jwtTokenKey)
    });
    return headers;
};

const fetchApiWrapper = async (url, init, successCallback, errorCallback) => {
    let apiResponseStatus;
    await fetch(url, init)
        .then(response => {
            apiResponseStatus = response.status;
            if (apiResponseStatus !== 200) {
                throw response.status;
            } else {
                return response.clone().json();
            }
        })
        .then(successCallback ? successCallback : response => {
            console.log('ray : [utils api fetchApiWrapper then] response => ', response);
        })
        .catch(error => {
            console.log('ray : [utils api fetchApiWrapper catch] error => ', error);
            apiUnauthorizedHandler(error);
            if (errorCallback) {
                errorCallback(error);
            } else {
                // TODO: general error handling unless status code is 401 
            }
        });
};

const fetchData = (url, successCallback, errorCallback) => {
    const init = {
        method: 'GET',
        headers: getHeaders()
    };

    fetchApiWrapper(url, init, successCallback, errorCallback);
};

const deleteFile = async (url, successCallback, errorCallback) => {
    const init = {
        method: 'DELETE',
        headers: getHeaders()
    };
    store.dispatch(setLoadingStatus({
        loading: true,
        text: "Deleting..."
    }));
    await fetchApiWrapper(url, init, successCallback, errorCallback);
    store.dispatch(setLoadingStatus({
        loading: false
    }));
}

const getAdaptedImageMetas = imageMetas => {
    const adaptedImageMetas = imageMetas.map(imageMeta => {
        const { width, height, x, y, fullPath, mimeType } = imageMeta;
        const extension = mimeType.split('/')[1];
        return {
            'image-path': fullPath,
            'image-type': extension,
            'image-width': width,
            'image-height': height,
            'image-x': x,
            'image-y': y
        };
    });
    return adaptedImageMetas;
};

// TODO: more meaningful function name
const render1 = (videoStepperState, successCallback, errorCallback) => {
    const { backgroundSize, backgroundImage, backgroundColor, headerFooters } = videoStepperState;
    let background = -1, backgroundStyle;
    if (backgroundImage) {
        background = 1;
        backgroundStyle = {
            'background-path': backgroundImage.fullPath
        };
    } else if (backgroundColor) {
        background = 0;
        backgroundStyle = {
            'background-color': backgroundColor
        };
    }
    if (background === -1) {
        throw new Error('background is not valid');
    }
    const adaptedHeaderFooters = getAdaptedImageMetas(headerFooters);
    const body = JSON.stringify({
        'background': background, // image background(1) or color background(0)
        ...backgroundStyle,
        'bg-width': backgroundSize.width,
        'bg-height': backgroundSize.height,
        'header-footer-images': adaptedHeaderFooters
    });
    const init = {
        method: 'POST',
        headers: getHeaders(),
        body
    };

    const renderStep = 'step1'; // TODO: hardcoded & not meaningful
    const url = getRenderingUrl(renderStep);
    fetchApiWrapper(url, init, successCallback, errorCallback);
};

const render2 = (videoStepperState, successCallback, errorCallback) => {
    const { backgroundSize, video, gifImages, texts } = videoStepperState;
    const adaptedGifImages = getAdaptedImageMetas(gifImages);
    const adaptedTexts = texts.map(text => {
        const { dataUrl, width, height, x, y } = text;
        return {
            'text-src': dataUrl,
            'text-width': width,
            'text-height': height,
            'text-x': x,
            'text-y': y
        }
    });
    const body = JSON.stringify({
        'template-width': backgroundSize.width,
        'template-height': backgroundSize.height,
        'video-path': video.fullPath,
        'video-width': video.width,
        'video-height': video.height,
        'video-x': video.x,
        'video-y': video.y,
        "gif-images": adaptedGifImages,
        "texts": adaptedTexts
    });
    const init = {
        method: 'POST',
        headers: getHeaders(),
        body
    };

    const renderStep = 'step2'; // TODO: hardcoded & not meaningful
    const url = getRenderingUrl(renderStep);
    fetchApiWrapper(url, init, successCallback, errorCallback);
};

const render3 = (videoStepperState, successCallback, errorCallback) => {
    const { video, subtitles } = videoStepperState;
    const adaptedSubtitles = subtitles.map((subtitle, index) => {
        const { from, to, text } = subtitle;
        const getAdaptedMoment = moment => {
            const second = convertDurationString(moment);
            const milliSecond = moment - parseInt(moment, 10);
            let adaptedMoment = second;
            if (milliSecond > 0) {
                adaptedMoment = `${adaptedMoment},${parseInt(milliSecond * 1000, 10)}`;
            } else if (milliSecond === 0) {
                adaptedMoment = `${adaptedMoment},${milliSecond}`;
            }
            return adaptedMoment;
        };

        const fromString = getAdaptedMoment(from);
        const toString = getAdaptedMoment(to);
        const adaptedSubtitle = `${index}\n${fromString} --> ${toString}\n${text}\n`;
        return adaptedSubtitle;
    });
    const subtitleContent = adaptedSubtitles.join('');
    const body = JSON.stringify({
        'subtitle': 0, // TODO: file subtitile(1) or text subtitle(0)
        'font-size': 20, // TODO: font size select
        'font-color': '0xFFFFFF', // TODO: font color select
        'subtitle-content': subtitleContent,
        'video-file-name': video.fileName
    });
    const init = {
        method: 'POST',
        headers: getHeaders(),
        body
    };

    const renderStep = 'step3'; // TODO: hardcoded & not meaningful
    const url = getRenderingUrl(renderStep);
    fetchApiWrapper(url, init, successCallback, errorCallback);
}

const download = (url, fileName) => {
    axios({
        url,
        method: 'GET',
        responseType: 'blob' // important
    }).then(response => {
        const blob = new Blob([response.data], {type: 'application/octet-stream'}); 
        FileSaver.saveAs(blob, fileName);
    });
};

export {
    getUploadedUrl,
    getUploadUrl,
    getFileRestUrl,
    fetchData,
    deleteFile,
    apiUnauthorizedHandler,
    render1,
    render2,
    render3,
    loginPrefix,
    registerPrefix,
    forgotPasswordPrefix,
    checkResetPasswordPrefix,
    resetPasswordPrefix,
    stripeProductPlansPrefix,
    stripeSubscribePrefix,
    currentUserPrefix,
    stripeCancelSubscriptionPrefix,
    stripeChangeSubscriptionPrefix,
    download
};
