const config = require('./../index.json');
const twilio = require('twilio')(config.twilio.sid, config.twilio.authToken);

const sendDecision = (user, approved) => {
    let text = `${user.display_name} we're sorry to inform you that your request to have edit rights on Hillcrest YM has been denied.`;
    if (approved) text = `${user.display_name} we're pleased to inform you that your request to have edit rights on Hillcrest YM has been approved. You may now login and edit activities.`;
    twilio.messages.create({
        to: user.phone,
        from: config.twilio.phoneNumber,
        body: text
    }, (err) => {
        if (err) console.log('text err', err);
    });
};

const notification = (user, post, dayOffset = false) => {
    let body = `Mutual notification: ${post.body} `;
    if (post.activity !== 'Anouncement') body += `at ${post.start_time} at ${post.location} `;
    if (dayOffset) user.alert_days += 1;
    if (user.alert_days === 0) body += 'today.';
    else if (user.alert_days === 1) body += 'tomorrow.';
    else if (user.alert_days === 2) body += 'in 2 days.';
    else if (user.alert_days === 3) body += 'in 3 days.';
    twilio.messages.create({
        to: user.phone,
        from: config.twilio.phoneNumber,
        body
    }, (err) => {
        if (err) console.log('text err', err);
    });
};

module.exports = {
    sendDecision,
    notification
};
