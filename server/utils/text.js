const config = require('./../index.json');
const twilio = require('twilio')(config.twilio.sid, config.twilio.authToken);

const sendDecision = (user, approved) => {
    let text = `${user.display_name} We're sorry to inform you that you're request to have edit rights on Hillcrest YM has been denied.`;
    if (approved) text = `${user.display_name} We're pleased to inform you that you're request to have edit rights on Hillcrest YM has been approved. You may now login and edit activities.`;
    twilio.sendMessage({
        to: user.phone,
        from: '+18016236835',
        body: text
    });
};

module.exports = {
    sendDecision
};
