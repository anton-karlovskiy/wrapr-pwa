
const Stripe = require('stripe');

const config = require('../config.json');
const { User } = require('../models/user');
const utils = require('../utils');

const subscriptionStripeStatus = {
    active: 'active',
    trialing: 'trialing',
    incomplete: 'incomplete'
};

const paymentIntentStripeStatus = {
    succeeded: 'succeeded',
    requires_payment_method: 'requires_payment_method',
    requires_action: 'requires_action'
};

// TODO: use dotenv and git igonore for standard and security
const stripeService = new Stripe(config.stripe.secretKey);
exports.getStripeProductPlans = function (req, res) {
    stripeService.plans.list(
        { 
            active: true,
            product: config.stripe.product
        },
        (error, plans) => {
            if (error) {
                return res.status(400).json({
                    ...error
                });
            }

            if (plans.data.length <= 0) {
                return res.status(404).json({
                    message: 'No plans found!'
                });
            }

            res.status(200).json({
                plans
            });
        }
    );
};

exports.stripeSubscribe = function (req, res) {
    const planId = req.body.planId;
    const token = req.body.token;
    const email = req.body.email;

    User.findOne({email})
        .then(async user => {
            if(!user) {
                return res.status(404).json({
                    message: 'User not found!'
                });
            }

            let customer;
            let subscription;
            try {
                // customer created and registered to stripe as well as internal database so update default token like card(payment method)
                if (user.stripe.customerId) {
                    // in outcome 3 case, a new token from customer collected so update customer's default source
                    customer = await stripeService.customers.update(user.stripe.customerId, {source: token.id, email});
                // customer not created so create new one on stripe account and register it to internal database
                } else {
                    customer = await stripeService.customers.create({source: token.id, email});
                    // register customer to internal database
                    user.stripe.customerId = customer.id;
                    user = await user.save();
                }

                let latestInvoice;
                // TODO: with latestInvoiceId on frontend
                if (planId === user.stripe.planId) {
                    // outcome 3 handling
                    latestInvoice = await stripeService.invoices.pay(user.stripe.latestInvoiceId, {
                        expand: ['payment_intent']
                    });
                    subscription = await stripeService.subscriptions.retrieve(user.stripe.subscriptionId);
                    user.stripe.subscriptionStatus = subscription.status;
                    user = await user.save();
                } else {
                    if (user.stripe.subscriptionId) {
                        await stripeService.subscriptions.del(user.stripe.subscriptionId);
                        user.stripe.subscriptionId = null;
                        user = await user.save();
                    }

                    subscription = await stripeService.subscriptions.create({
                        customer: customer.id,
                        items: [
                            {plan: planId}
                        ],
                        expand: ['latest_invoice.payment_intent']
                    });
                    latestInvoice = subscription.latest_invoice;
                    user.stripe.subscriptionId = subscription.id;
                    user.stripe.subscriptionStatus = subscription.status;
                    user.stripe.planId = planId;
                    user = await user.save();
                }

                const paymentIntentStatus = latestInvoice.payment_intent ? latestInvoice.payment_intent.status : null;
                user.stripe.paymentIntentStatus = paymentIntentStatus;

                // outcome 1 -> payment is complete, and you should promptly provision access to the service
                if (subscription.status === subscriptionStripeStatus.active || paymentIntentStatus === paymentIntentStripeStatus.succeeded) {
                    user.stripe.latestInvoiceId = null;
                    user.role.videoSubscriber = true;
                    user = await user.save();
                    return res.status(200).json({
                        user: utils.getUserPayload(user)
                    });
                } else {
                    // outcome 3 -> payment fails due to a card_error, reattempt payment using a different payment method
                    if (paymentIntentStatus === paymentIntentStripeStatus.requires_payment_method) {
                        user.stripe.latestInvoiceId = latestInvoice.id;
                        user = await user.save();
                        // TODO: outcome 3 handling
                        return res.status(403).json({
                            message: 'Charge attempt for the subscription failed, and that a new payment method is required to proceed.'
                        });
                    // outcome 4 -> payment requires customer action
                    } else if (paymentIntentStatus === paymentIntentStripeStatus.requires_action) {
                        // TODO: outcome 4 handling
                    }
                }

                res.status(500).json({
                    message: 'Something went wrong on the server side.'
                });
            } catch (error) {
                console.log('ray : [stripe route stripeSubscribe] error => ', error);
                res.status(400).json({
                    ...error
                });
            }
        });
};

const prorate = async subscriptionId => {
    const subscription = await stripeService.subscriptions.retrieve(subscriptionId);
    const timeStamp = Math.floor(Date.now() / 1000);
    const periodStart = subscription.current_period_start;
    const periodEnd = subscription.current_period_end;
    const amount = subscription.plan.amount;
    console.log('ray : subscription plan amount => ', amount);

    const periodLength = periodEnd - periodStart;
    const elapsedSinceStart = timeStamp - periodStart;

    const proration = amount - Math.floor(elapsedSinceStart / periodLength * amount);
    console.log('ray : prorate proration => ', proration);
    return proration;
};

const cancelSubscription = async (user, subscriptionId) => {
    if (subscriptionId) {
        await stripeService.subscriptions.del(subscriptionId);
    }
    user.stripe.planId = null;
    user.stripe.subscriptionId = null;
    user.stripe.paymentIntentStatus = null;
    user.stripe.subscriptionStatus = null;
    user.role.videoSubscriber = false;
    user = await user.save();
};

exports.stripeCancelSubscription = async function (req, res) {
    try {
        let user = req.user;
        // will prorate the unused part of the subscription if configured, subscription in active state, and proration
        // TODO: this is error prone, when more than twice upgrading and canceling because refund money is greater than the latest invoice amount
        const subscriptionStatus = user.stripe.subscriptionStatus;
        if (config.prorate && subscriptionStatus === subscriptionStripeStatus.active) {
            const proration = await prorate(user.stripe.subscriptionId);
            const invoices = await stripeService.invoices.list({subscription: user.stripe.subscriptionId});
            const invoice = invoices.data[0];
            if (invoices && invoice.charge && proration > 0) {
                await stripeService.refunds.create({
                    charge: invoice.charge,
                    amount: proration
                });
            }
        }

        await cancelSubscription(user, user.stripe.subscriptionId);
        res.status(200).json({
            user
        });
    } catch (error) {
        console.log('ray : [stripe route stripeCancelSubscription] error => ', error);
        res.status(400).json({
            ...error
        });
    }
};

exports.stripeChangeSubscription = async function (req, res) {
    try {
        const nextPlanId = req.body.nextPlanId;
        let user = req.user;

        const prorationDate = Math.floor(Date.now() / 1000); // set proration date to this moment:
        const subscription = await stripeService.subscriptions.retrieve(user.stripe.subscriptionId);

        // see what the next invoice would look like with a plan switch and proration set
        const items = [{
            id: subscription.items.data[0].id,
            plan: nextPlanId // switch to new plan
        }];

        const invoice = await stripeService.invoices.retrieveUpcoming(user.stripe.customerId, user.stripe.subscriptionId, {
            subscription_items: items,
            subscription_proration_date: prorationDate
        });

        // calculate the proration cost
        const currentProrations = [];
        let cost = 0;
        for (let i = 0; i < invoice.lines.data.length; i++) {
            const invoiceItem = invoice.lines.data[i];
            if (invoiceItem.period.start == prorationDate) {
                currentProrations.push(invoiceItem);
                cost += invoiceItem.amount;
            }
        }
        // TODO: confirm this info with customer before changing subscription
        console.log('ray : cost => ', cost);

        const updatedSubscription = await stripeService.subscriptions.update(user.stripe.subscriptionId, {
            items,
            proration_date: prorationDate,
            expand: ['latest_invoice.payment_intent']
        });
        user.stripe.planId = nextPlanId;
        user.stripe.subscriptionStatus = updatedSubscription.status;
        user = await user.save();

        res.status(200).json({
            user
        });
    } catch (error) {
        console.log('ray : [stripe route stripeChangeSubscription] error => ', error);
        res.status(400).json({
            ...error
        });
    }
};

exports.stripeListenWebhook = async function (req, res) {
    const stripeSignature = req.headers['stripe-signature'];
    let event;
    try {
        // TODO: use dotenv and git igonore for standard and security
        event = await stripeService.webhooks.constructEvent(req.rawBody, stripeSignature, config.stripe.webhookSigningSecret);
        // console.log('ray : [stripe route stripeListenWebhook] event => ', event);

        switch(event.type) {
            // subscription canceled
            case "customer.subscription.deleted": {
                // event’s request property is not null, that indicates the cancellation was made by your request (as opposed to automatically based upon your subscription settings)
                if (event.request === null) {
                    const customerId = event.data.object.customer;
                    const customer = await stripeService.customers.retrieve(customerId);
                    let user = await User.findOne({email: customer.email});
                    await cancelSubscription(user);
                } else {
                    return res.status(200).send(`Webhook received: type ${event.type} is called by your request so not handled in this hook event`);
                }
                break;
            }
            // subscription status changed
            case "customer.subscription.updated": {
                if (event.request === null) {
                    const subscriptionStatus = event.data.object.status;
                    if (subscriptionStatus !== subscriptionStripeStatus.active) {
                        const customerId = event.data.object.customer;
                        const customer = await stripeService.customers.retrieve(customerId);
                        let user = await User.findOne({email: customer.email});
                        const subscriptionId = event.data.object.id;
                        await cancelSubscription(user, subscriptionId);
                    }
                } else {
                    return res.status(200).send(`Webhook received: type ${event.type} is called by your request so not handled in this hook event`);
                }
                break;
            }
            default:
                return res.status(200).send(`Webhook received: other type event id ${event.id} event type ${event.type}`); 
        }
    } catch (error) {
        console.log('ray : [stripe route stripeListenWebhook] error => ', error);
        return res.status(500).json({
            error
        });
    }

    res.status(200).json({
        message: `Successfully handled for event ${event.type}`
    });
}
