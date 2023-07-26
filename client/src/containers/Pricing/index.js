
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AlertDialog from '../../components/AlertDialog';
import Loading from '../../components/Loading';
import CustomStripeCheckout from './CustomStripeCheckout';
import {
    getStripeProductPlans,
    stripeSubscribe,
    stripeCancelSubscription,
    stripeChangeSubscription
} from '../../actions/stripe';
import { setLoadingStatus } from '../../actions/loadingStatus';
import { setCurrentUser } from '../../actions/authentication';
import { getSpacingUnit } from '../../utils/utility';

const subscriptionStripeStatus = {
    active: 'active',
    trialing: 'trialing',
    incomplete: 'incomplete',
    past_due: 'past_due'
};

const paymentIntentStripeStatus = {
    succeeded: 'succeeded',
    requires_payment_method: 'requires_payment_method',
    requires_action: 'requires_action'
};

const sthWrong = 'Oops something went wrong! Please contact service center.';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        '@global': {
            body: {
                backgroundColor: theme.palette.common.white
            }
        },
        layout: {
            width: 'auto',
            marginLeft: spacingUnit,
            marginRight: spacingUnit,
            [theme.breakpoints.up(900 + spacingUnit * 3 * 2)]: {
                width: '97%',
                marginLeft: 'auto',
                marginRight: 'auto'
            }
        },
        heroContent: {
            maxWidth: 600,
            margin: '0 auto'
        },
        cardHeader: {
            backgroundColor: theme.palette.grey[200]
        },
        cardContent: {
            minHeight: spacingUnit * 25
        },
        cardPricing: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginBottom: spacingUnit * 2
        },
        cardActions: {
            display: 'block',
            [theme.breakpoints.up('sm')]: {
                paddingBottom: spacingUnit * 2
            }
        }
    };
};

class Pricing extends Component {
    state = {
        plans: [],
        isLoading: true,
        error: null,
        alertOpen: false,
        alertStrings: []
    };

    componentDidMount() {
        const { getStripeProductPlans } = this.props;
        const successCallback = response => {
            const { data: { plans } } = response;
            this.setState({isLoading: false, plans: plans.data});
        };
        const errorCallback = error => {
            const { data, status } = error.response;
            console.log('ray : [Pricing getStripeProductPlans errorCallback] error.response => ', error.response);
            this.setState({isLoading: false, error: {status, ...data}});
        };
        getStripeProductPlans(successCallback, errorCallback);
    }

    getTiers = plans => {
        const { user } = this.props;
        if (!user) {
            return [];
        }
        let tiers = plans.map(plan => {
            const { nickname, amount, metadata, id } = plan;
            const { cycleSign, description } = metadata;
            const descriptionItems = description.split(',');
            let buttonDisabled = false;
            let notice = {
                color: '',
                messages: []
            };
            let newlySubscribe = false;

            if (user.stripe.subscriptionStatus !== subscriptionStripeStatus.active) {
                newlySubscribe = true;
            }

            let buttonText;
            // in the case that subscription status is past_due, disable current plan button
            if (user.stripe.planId === id && user.stripe.subscriptionStatus !== subscriptionStripeStatus.incomplete) {
                buttonText = 'Started';
                notice = {
                    color: 'secondary',
                    messages: [
                        'Now on this plan'
                    ]
                };
                buttonDisabled = true;
            // TODO: outcome 3 case
            } else if (user.stripe.planId === id && user.stripe.subscriptionStatus !== subscriptionStripeStatus.active && user.stripe.paymentIntentStatus === paymentIntentStripeStatus.requires_payment_method) {
                buttonText = 'Try another payment method';
                notice = {
                    color: 'error',
                    messages: [
                        'Payment fails due to a card_error',
                        'Try a different payment method'
                    ]
                };
            // TODO: outcome 4 case
            } else if (user.stripe.planId === id && user.stripe.subscriptionStatus !== subscriptionStripeStatus.active && user.stripe.paymentIntentStatus === paymentIntentStripeStatus.requires_action) {
                buttonText = '3D secure required';
                notice = {
                    color: 'error',
                    messages: [
                        'Payment requires customer action'
                    ]
                };
            } else {
                buttonText = 'Get started';
            }
            
            return {
                title: nickname,
                price: amount,
                description: descriptionItems,
                cycleSign: `/${cycleSign}` || '',
                buttonText,
                notice,
                buttonDisabled,
                planId: id,
                newlySubscribe
            };
        });

        let buttonDisabled = true;
        let notice = {
            color: 'secondary',
            messages: [
                'Now on this plan'
            ]
        };
        if (user && user.stripe && user.stripe.planId) {
            buttonDisabled = false;
            notice = {
                color: '',
                messages: []
            };
        }

        const trial = {
            title: 'Basic',
            price: 0,
            description: [
                'FREE trial',
                'Exports with big water mark on video'
            ],
            cycleSign: '',
            buttonDisabled,
            notice,
            buttonText: 'Sign up for free'
        };

        tiers = [trial, ...tiers];
        tiers.sort((a, b) => (
            a.price - b.price
        ));

        return tiers;
    };

    successCallback = response => {
        const { setCurrentUser, setLoadingStatus } = this.props;
        setLoadingStatus({ 
            loading: false
        });
        const { data: { user } } = response;
        setCurrentUser(user);
    };

    errorCallback = error => {
        const { setLoadingStatus } = this.props;
        setLoadingStatus({
            loading: false
        });
        const { response } = error;
        if (response.status === 403) {
            this.alertOpenHandler([response.data.message]);
        } else {
            this.alertOpenHandler([sthWrong]);
        }
    };

    subscribeHandler = (title, planId, token, email) => {
        const { stripeSubscribe, setLoadingStatus } = this.props;
        setLoadingStatus({
            loading: true,
            text: `Subscribing to ${title} Plan...`
        });
        
        stripeSubscribe({planId, token, email}, this.successCallback, this.errorCallback);
    };

    cancelSubscriptionHandler = () => {
        const { stripeCancelSubscription, setLoadingStatus } = this.props;
        setLoadingStatus({
            loading: true,
            text: `Canceling plan...`
        });

        stripeCancelSubscription(this.successCallback, this.errorCallback);
    };

    changeSubscriptionHandler = (nextPlanId, nextPlanPrice) => {
        const { stripeChangeSubscription, setLoadingStatus, user } = this.props;
        const { plans } = this.state;
        const currentPlan = plans.find(plan => (plan.id === user.stripe.planId));
        const currentPlanPrice = currentPlan.amount;

        setLoadingStatus({
            loading: true,
            text: `${currentPlanPrice > nextPlanPrice ? 'Downgrading' : 'Upgrading'} plan...`
        });
        
        stripeChangeSubscription({nextPlanId}, this.successCallback, this.errorCallback);
    };

    alertOpenHandler = (alertStrings) => {
        this.setState({alertOpen: true, alertStrings});
    };

    alertClosehandler = () => {
        this.setState({alertOpen: false});
    };

    render() {
        const { classes, user } = this.props;
        const { isLoading, plans, error } = this.state;
        const tiers = this.getTiers(plans);
        
        if (isLoading) {
            return (
                <Loading />
            );
        }

        if (error) {
            return (
                <Typography>
                    {sthWrong}
                </Typography>
            );
        }

        return (
            <Fragment>
                <AlertDialog
                    opened={this.state.alertOpen}
                    closed={this.alertClosehandler}
                    content={this.state.alertStrings} />
                <main className={classes.layout}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                            Pricing Plans
                        </Typography>
                    </div>
                    <Grid container spacing={2} alignItems="flex-end">
                        { tiers.map(tier => (
                            <Grid
                                item
                                key={tier.title}
                                xs={12} md={3}>
                                <Card>
                                    <CardHeader
                                        title={tier.title}
                                        subheader={tier.subheader}
                                        titleTypographyProps={{align: 'center'}}
                                        subheaderTypographyProps={{align: 'center'}}
                                        // current subscription state
                                        action={tier.planId === user.stripe.planId && <StarIcon />}
                                        className={classes.cardHeader} />
                                    <CardContent className={classes.cardContent}>
                                        <div className={classes.cardPricing}>
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                ${tier.price / 100}
                                            </Typography>
                                            <Typography variant="h6" color="textSecondary">
                                                {tier.cycleSign}
                                            </Typography>
                                        </div>
                                        { tier.description.map(line => (
                                            <Typography variant="subtitle1" align="center" key={line}>
                                                {line}
                                            </Typography>
                                        )) }
                                        { tier.notice && tier.notice.messages.length > 0 &&  <hr width="80%" /> }
                                        { tier.notice && tier.notice.messages.map(line => (
                                            <Typography color={tier.notice.color} variant="subtitle1" align="center" key={line}>
                                                {line}
                                            </Typography>
                                        )) }
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <CustomStripeCheckout
                                            user={user}
                                            tier={tier}
                                            subscribeHandler={this.subscribeHandler}
                                            changeSubscriptionHandler={this.changeSubscriptionHandler}
                                            cancelSubscriptionHandler={this.cancelSubscriptionHandler} />
                                    </CardActions>
                                </Card>
                            </Grid>
                        )) }
                    </Grid>
                </main>
            </Fragment>
        );
    }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.auth.user
});
const mapActionToProps = {
    getStripeProductPlans,
    stripeSubscribe,
    setLoadingStatus,
    setCurrentUser,
    stripeCancelSubscription,
    stripeChangeSubscription
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Pricing));
