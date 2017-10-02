const config = require('./../index.json');
const twilio = require('twilio')(config.twilio.sid, config.twilio.authToken);
const CronJob = require('cron').CronJob;
const postModel = require('./../models/postModel');

const reminders = new CronJob({
    cronTime: '00 00 10 * * *',
    onTick: async () => {
        console.log('Cron started');
        console.log('Cron Done!');
    },
    start: true,
    timeZone: 'America/Denver',
    runOnInit: false
});

// twilio.sendMessage({
//     to: phone,
//     from: '+18016236835',
//     body: `Your ${message.message.nickname} is ${message.message.status}!`
//   });

module.exports = {
    reminders
};
