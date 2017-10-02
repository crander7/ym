const nodemailer = require('nodemailer');
const config = require('./../index.json');

const EMAIL_ACCOUNT_USER = config.mailer.email;
const EMAIL_ACCOUNT_PASSWORD = config.mailer.password;
const YOUR_NAME = config.mailer.name;

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ACCOUNT_USER,
        pass: EMAIL_ACCOUNT_PASSWORD
    }
});

const sendDecision = (user, approved) => {
    let subject = 'Edit Request Denied';
    let text = `Dear ${user.display_name},\n\n\tWe're sorry to inform you that you're request to have edit rights\non Hillcrest YM has been denied.\n\nSincerely,\n\n\tThe awesome developer of Hillcrest YM`;
    if (approved) {
        subject = 'Edit Request Approved';
        text = `Dear ${user.display_name},\n\n\tWe're pleased to inform you that you're request to have edit rights\non Hillcrest YM has been approved. You may now login and edit activities.\n\nSincerely,\n\n\tThe awesome developer of Hillcrest YM`;
    }
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: user.email,
        subject,
        text
    });
};

module.exports = {
    sendDecision
};
