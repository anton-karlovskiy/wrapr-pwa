
- server must be linux(Ubuntu)

- node
node > 10

- reset email setting
reference url: https://itnext.io/password-reset-emails-in-your-react-app-made-easy-with-nodemailer-bb27968310d7

There’s an extra gotcha to be aware of when setting up the transporter email that all the emails are sent from, at least, when using Gmail.
1. 2-Step verification must be disabled
2. setting titled ‘Allow less secure apps’ must be toggled to on

- stripe setting
https://dashboard.stripe.com
1. create one product for this application, naming does not matter(e.g. videowrappr).
2. create three pricing plans
        plan detail:        metadata:           metadata:
plan1   monthly($9.97)      cycleSign: mo       description: No watermark
plan2   6 month($48)        cycleSign: 6-mo     description: No watermark, It works out at $8 Per Month
plan3   yearly($64)         cycleSign: 12-mo    description: No watermark, It works out at $7 Per Month
3. catch that product id(e.g. prod_F0tDOTaJQc4HGf) and stripe secret key(e.g. sk_test_P5n9Nv9ZKEJccHHLfnKK3v3a) and set them in config.json. (stripe variables should go to dotenv and get git ignored under standard for security)
4. configure the settings
https://dashboard.stripe.com/account/billing/automatic
custom: Manage failed payments/Retry schedule/Retry up to 4 times within -> 1 week
custom: Manage failed payments/Customer emails/Send emails when payments fail -> true
strict: Manage failed payments/Subscription status/If all retries for a payment fail -> cancel the subscription
* https://dashboard.stripe.com/settings -> invite team memeber
5. webhook setting
https://dashboard.stripe.com/{livemode -> test or live}/webhooks -> add webhook endpoint to stripe account from config.json and web hostname
webhook endpoint looks like -> https://{backend hostname}/api/stripe-listen-webhook
set webhook signing secret in config.json caught from stripe account developers/webhooks
confirm webhook setting by sending test webhook... and checking response on stripe account
limit webhook events to necessary events in business logic, make sure you only send events that you actually want to process on your API (e.g. customer.subscription.deleted, customer.subscription.updated)

event list
customer.subscription.deleted -> https://stripe.com/docs/billing/subscriptions/canceling-pausing
customer.subscription.updated -> https://stripe.com/docs/billing/subscriptions/payment -> past_due search

for refund and dispute, we can downgrade user manually using some UI or use webhooks
no, it has no service memebers, so at least for refund and dispute we should be able to downgrade their roles to free trial in webhook
"charge.dispute.funds_reinstated":
"charge.dispute.funds_withdrawn"
"charge.dispute.funds_updated"
"charge.dispute.funds_closed"
"charge.dispute.created"
"charge.refunded"

