
const nodemailer = require('nodemailer');

const config = require('../config.json');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // TODO: use dotenv and git igonore for standard and security
        user: `${config.emailAddress}`,
        pass: `${config.emailPassword}`
    }
});

exports.sendEmail = async (toAddress, subject, text) => {
    const mailOptions = {
        from: `${config.fromEmailAddress}`, // TODO: check from email
        to: `${toAddress}`,
        subject,
        text
    };
    await transporter.sendMail(mailOptions);
};
