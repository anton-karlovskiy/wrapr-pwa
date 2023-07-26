
const passport = require('passport');

const authentication = require('./authentication');
const file = require('./file');
const render = require('./render');
const stream = require('./stream');
const stripe = require('./stripe');
const config = require('../config.json');

exports.assignRoutes = function (app) {
    app.post('/api/login', authentication.login);
    app.post('/api/register', authentication.register);
    app.post('/api/forgot-password', authentication.forgotPassword);
    app.get('/api/check-reset-password', authentication.checkResetPassword);
    app.put('/api/reset-password', authentication.resetPassword);
    app.get('/api/me', passport.authenticate('jwt', { session: false }), authentication.me);
    
    app.get('/api/stripe-product-plans', passport.authenticate('jwt', { session: false }), stripe.getStripeProductPlans);
    app.post('/api/stripe-subscribe', passport.authenticate('jwt', { session: false }), stripe.stripeSubscribe);
    app.post('/api/stripe-cancel-subscription', passport.authenticate('jwt', { session: false }), stripe.stripeCancelSubscription);
    app.post('/api/stripe-change-subscription', passport.authenticate('jwt', { session: false }), stripe.stripeChangeSubscription);
    app.post(config.stripe.webhookEndpoint, stripe.stripeListenWebhook);

    app.post('/api/upload', passport.authenticate('jwt', { session: false }), file.uploadFile);
    app.get('/api/files', passport.authenticate('jwt', { session: false }), file.getFiles);
    app.get('/api/files/:id', passport.authenticate('jwt', { session: false }), file.getFile);
    app.delete('/api/files/:id', passport.authenticate('jwt', { session: false }), file.deleteFile);

    app.post('/api/render/step1', passport.authenticate('jwt', { session: false }), render.renderStep1);
    app.post('/api/render/step2', passport.authenticate('jwt', { session: false }), render.renderStep2);
    app.post('/api/render/step3', passport.authenticate('jwt', { session: false }), render.renderStep3);

    app.get('/api/stream/:id', stream.streamVideo);
};
