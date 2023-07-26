
import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Button from '@material-ui/core/Button';

import config from '../../../config';
import logo from '../../../assets/images/logos/app-icon-96x96.png';

const CustomStripeCheckout = ({ tier, user, subscribeHandler, cancelSubscriptionHandler, changeSubscriptionHandler }) => {
    let tokenSentReady = false;
    const onToken = token => {
        if (tokenSentReady) {
            subscribeHandler(tier.title, tier.planId, token, user.email);
        }
    };

    const onOpened = () => {
        tokenSentReady = true;
    };

    const onClosed = () => {
        tokenSentReady = false;
    };

    const checkLocalhost = () => {
        return window.location.host.includes('localhost');
    };

    if (tier.buttonDisabled) {
        return (
            <Button
                fullWidth
                disabled
                variant="outlined"
                color="primary">
                {tier.buttonText}
            </Button>
        );
    }

    if (tier.price <= 0) {
        return (
            <Button
                fullWidth
                onClick={cancelSubscriptionHandler}
                variant="contained"
                color="primary">
                {tier.buttonText}
            </Button>
        );
    }

    if (!tier.newlySubscribe) {
        return (
            <Button
                fullWidth
                onClick={() => changeSubscriptionHandler(tier.planId, tier.price)}
                variant="contained"
                color="primary">
                {tier.buttonText}
            </Button>
        );
    }

    return (
        <StripeCheckout
            name="VideoWrappr" // the pop-in header title
            description="Create your masterpiece!" // the pop-in header subtitle
            image={!checkLocalhost() ? logo : null} // the pop-in header image
            ComponentClass="div"
            panelLabel="Pay" // prepended to the amount in the bottom pay button
            amount={tier.price} // cents
            currency={config.stripe.currency}
            locale="en"
            email={user.email}
            opened={onOpened} // called when the checkout popin is opened
            closed={onClosed} // called when the checkout popin is closed
            token={onToken}
            stripeKey={config.stripe.publicKey}>
            <Button
                fullWidth
                variant="contained"
                color="primary">
                {tier.buttonText}
            </Button>
        </StripeCheckout>
    );
};

export default CustomStripeCheckout;
