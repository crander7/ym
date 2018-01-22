const nodemailer = require('nodemailer');
const konfig = require('konphyg')(`${__dirname}/../../config`);

const config = konfig('index');

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
    let text = `Dear ${user.display_name},\n\n\tWe're sorry to inform you that your request to have edit rights\non Hillcrest YM has been denied.\n\nSincerely,\n\n\tThe awesome developer of Hillcrest YM`;
    if (approved) {
        subject = 'Edit Request Approved';
        text = `Dear ${user.display_name},\n\n\tWe're pleased to inform you that your request to have edit rights\non Hillcrest YM has been approved. You may now login and edit activities.\n\nSincerely,\n\n\tThe awesome developer of Hillcrest YM`;
    }
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: user.email,
        subject,
        text
    }, (err) => {
        if (err) console.log('email err', err);
    });
};

const sendErrorReport = (error, location) => {
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: config.mailer.email,
        subject: 'Hillcrest Youth Error Report',
        text: `A server error has occured on Hillcrest Youth on the ${location} endpoint.\n${error}`
    }, (err) => {
        if (err) console.log('email err', err);
    });
};

const editReq = (user) => {
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: config.mailer.email,
        subject: 'Leader Access Request',
        text: `${user.display_name} has requested leader access in Hillcrest Youth. Go check it out.`
    }, (err) => {
        if (err) console.log('email err', err);
    });
};

const notification = (user, post, dayOffset = false) => {
    let text = `Hey ${user.display_name.split(' ')[0]},\n\n\tThere's ${post.title} `;
    if (dayOffset) user.alert_days += 1;
    if (user.alert_days === 0) text += 'happening today';
    else if (user.alert_days === 1) text += 'happening tomorrow';
    else if (user.alert_days === 2) text += 'happening in 2 days';
    else if (user.alert_days === 3) text += 'happening in 3 days';
    if (post.activity !== 'Anouncement') text += ` meet  at ${post.start_time}. The activity details are: ${post.body}`;
    text += '\n\nPlease visit https://1stwardym.com for more information. This is an automated email.';
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: user.email,
        subject: 'Hillcrest Youth Activity',
        text
    }, (err) => {
        if (err) console.log('email err', err);
    });
};

const parentNotification = (user, post, dayOffset = false) => {
    let text = `Regarding: ${user.name}\n\n\tThere's ${post.title} `;
    if (dayOffset) user.alert_days += 1;
    if (user.alert_days === 0) text += 'happening today';
    else if (user.alert_days === 1) text += 'happening tomorrow';
    else if (user.alert_days === 2) text += 'happening in 2 days';
    else if (user.alert_days === 3) text += 'happening in 3 days';
    if (post.activity !== 'Anouncement') text += ` meet  at ${post.start_time}. The activity details are: ${post.body}`;
    text += '\n\nPlease visit https://1stwardym.com for more information. This is an automated email.';
    smtpTransport.sendMail({
        from: `${YOUR_NAME} ${EMAIL_ACCOUNT_USER}`,
        to: user.email,
        subject: 'Hillcrest Youth Activity',
        text
    }, (err) => {
        if (err) console.log('email err', err);
    });
};

module.exports = {
    sendDecision,
    sendErrorReport,
    editReq,
    notification,
    parentNotification
};
