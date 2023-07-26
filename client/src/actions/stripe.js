
import axios from 'axios';
import urlJoin from 'url-join';

import {
    stripeProductPlansPrefix,
    stripeSubscribePrefix,
    apiUnauthorizedHandler,
    stripeCancelSubscriptionPrefix,
    stripeChangeSubscriptionPrefix
} from '../utils/api';
import config from '../config';

export const getStripeProductPlans = (successCallback, errorCallback) => dispatch => {
    axios.get(urlJoin(config.proxyUrl, stripeProductPlansPrefix))
        .then(successCallback)
        .catch(error => {
            // TODO: api error handling -> axios utility could be used
            console.log('ray : [stripe action getStripeProductPlans] error => ', error);
            apiUnauthorizedHandler(error.response.status);
            if (errorCallback) {
                errorCallback(error);
            }
        });
};

export const stripeSubscribe = (data, successCallback, errorCallback) => dispatch => {
    axios.post(urlJoin(config.proxyUrl, stripeSubscribePrefix), data)
        .then(response => {
            successCallback && successCallback(response);
        })
        .catch(error => {
            console.log('ray : [stripe action stripeSubscribe] error.response => ', error.response);
            apiUnauthorizedHandler(error.response.status);
            errorCallback && errorCallback(error);
        });
};

export const stripeCancelSubscription = (successCallback, errorCallback) => dispatch => {
    axios.post(urlJoin(config.proxyUrl, stripeCancelSubscriptionPrefix))
        .then(response => {
            successCallback && successCallback(response);
        })
        .catch(error => {
            console.log('ray : [stripe action stripeCancelSubscription] error.response => ', error.response);
            apiUnauthorizedHandler(error.response.status);
            errorCallback && errorCallback(error);
        });
};

export const stripeChangeSubscription = (data, successCallback, errorCallback) => dispatch => {
    axios.post(urlJoin(config.proxyUrl, stripeChangeSubscriptionPrefix), data)
        .then(response => {
            successCallback && successCallback(response);
        })
        .catch(error => {
            console.log('ray : [stripe action stripeChangeSubscription] error.response => ', error.response);
            apiUnauthorizedHandler(error.response.status);
            errorCallback && errorCallback(error);
        });
};
