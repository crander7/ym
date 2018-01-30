const CronJob = require('cron').CronJob;
const postModel = require('./../models/postModel');
const userModel = require('./../models/userModel');
const email = require('./../utils/email');
const text = require('./../utils/text');


const reminders = new CronJob({
    cronTime: '00 00 * * * *',
    onTick: async () => {
        console.log('Notificatin cron started');
        let hour;
        let today;
        const day = new Date();
        if (day.getHours() <= 1) today = day.getDate() - 1;
        else today = day.getDate();
        if (day.getHours() <= 21) hour = day.getHours() - 2;
        else {
            if (day.getHours() === 22) hour = 0;
            if (day.getHours() === 23) hour = 1;
        }
        day.setDate(day.getDate() - 1);
        day.setHours(0, 0, 0);
        const sameDay = [];
        const dayBefore = [];
        const twoDaysBefore = [];
        const threeDaysBefore = [];
        const todayPosts = [];
        const tomorrow = [];
        const twoDaysFromNow = [];
        const threeDaysFromNow = [];
        let users = [];
        let posts = [];
        try {
            users = await userModel.getAllUsers4Notifications(hour);
            posts = await postModel.getNext3DaysPosts(day.getTime());
        } catch (e) {
            email.sendErrorReport(e, 'notification cron');
        }
        for (let i = 0; i < users.length; i += 1) {
            if (users[i].alert_days === 0) sameDay.push(users[i]);
            if (users[i].alert_days === 1) dayBefore.push(users[i]);
            if (users[i].alert_days === 2) twoDaysBefore.push(users[i]);
            if (users[i].alert_days === 3) threeDaysBefore.push(users[i]);
        }
        for (let i = 0; i < posts.length; i += 1) {
            if (posts[i].start_date.getDate() === today) todayPosts.push(posts[i]);
            if (posts[i].start_date.getDate() === today + 1) tomorrow.push(posts[i]);
            if (posts[i].start_date.getDate() === today + 2) twoDaysFromNow.push(posts[i]);
            if (posts[i].start_date.getDate() === today + 3) threeDaysFromNow.push(posts[i]);
        }
        for (let i = 0; i < sameDay.length; i += 1) {
            for (let j = 0; j < todayPosts.length; j += 1) {
                if (sameDay[i].alerts === 'email' && sameDay[i].alert_hour && (sameDay[i].alert_days.toString()) && (todayPosts[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || todayPosts[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(todayPosts[j].start_time, sameDay[i].alert_hour)) email.notification(sameDay[i], todayPosts[j]);
                else if (sameDay[i].alerts === 'text' && sameDay[i].alert_hour && (sameDay[i].alert_days.toString()) && (todayPosts[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || todayPosts[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(todayPosts[j].start_time, sameDay[i].alert_hour)) text.notification(sameDay[i], todayPosts[j]);
            }
            for (let j = 0; j < tomorrow.length; j += 1) {
                if (sameDay[i].alerts === 'email' && sameDay[i].alert_hour && (sameDay[i].alert_days.toString()) && (tomorrow[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && activityNotificationThreshold(tomorrow[j].start_time, sameDay[i].alert_hour)) email.notification(sameDay[i], tomorrow[j], true);
                else if (sameDay[i].alerts === 'text' && sameDay[i].alert_hour && (sameDay[i].alert_days.toString()) && (tomorrow[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && activityNotificationThreshold(tomorrow[j].start_time, sameDay[i].alert_hour)) text.notification(sameDay[i], tomorrow[j], true);
            }
        }
        for (let i = 0; i < dayBefore.length; i += 1) {
            for (let j = 0; j < tomorrow.length; j += 1) {
                if (dayBefore[i].alerts === 'email' && dayBefore[i].alert_hour && dayBefore[i].alert_days && (tomorrow[j].groups.indexOf(dayBefore[i].class) !== -1 || dayBefore[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(tomorrow[j].start_time, dayBefore[i].alert_hour)) email.notification(dayBefore[i], tomorrow[j]);
                else if (dayBefore[i].alerts === 'text' && dayBefore[i].alert_hour && dayBefore[i].alert_days && (tomorrow[j].groups.indexOf(dayBefore[i].class) !== -1 || dayBefore[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(tomorrow[j].start_time, dayBefore[i].alert_hour)) text.notification(dayBefore[i], tomorrow[j]);
            }
        }
        for (let i = 0; i < twoDaysBefore.length; i += 1) {
            for (let j = 0; j < twoDaysFromNow.length; j += 1) {
                if (twoDaysBefore[i].alerts === 'email' && twoDaysBefore[i].alert_hour && twoDaysBefore[i].alert_days && (twoDaysFromNow[j].groups.indexOf(twoDaysBefore[i].class) !== -1 || twoDaysBefore[i].class === 'Adults' || twoDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(twoDaysFromNow[j].start_time, twoDaysBefore[i].alert_hour)) email.notification(twoDaysBefore[i], twoDaysFromNow[j]);
                else if (twoDaysBefore[i].alerts === 'text' && twoDaysBefore[i].alert_hour && twoDaysBefore[i].alert_days && (twoDaysFromNow[j].groups.indexOf(twoDaysBefore[i].class) !== -1 || twoDaysBefore[i].class === 'Adults' || twoDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(twoDaysFromNow[j].start_time, twoDaysBefore[i].alert_hour)) text.notification(twoDaysBefore[i], twoDaysFromNow[j]);
            }
        }
        for (let i = 0; i < threeDaysBefore.length; i += 1) {
            for (let j = 0; j < threeDaysFromNow.length; j += 1) {
                if (threeDaysBefore[i].alerts === 'email' && threeDaysBefore[i].alert_hour && threeDaysBefore[i].alert_days && (threeDaysFromNow[j].groups.indexOf(threeDaysBefore[i].class) !== -1 || threeDaysBefore[i].class === 'Adults' || threeDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(threeDaysFromNow[j].start_time, threeDaysBefore[i].alert_hour)) email.notification(threeDaysBefore[i], threeDaysFromNow[j]);
                else if (threeDaysBefore[i].alerts === 'text' && threeDaysBefore[i].alert_hour && threeDaysBefore[i].alert_days && (threeDaysFromNow[j].groups.indexOf(threeDaysBefore[i].class) !== -1 || threeDaysBefore[i].class === 'Adults' || threeDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(threeDaysFromNow[j].start_time, threeDaysBefore[i].alert_hour)) text.notification(threeDaysBefore[i], threeDaysFromNow[j]);
            }
        }

        // Start cron for parents
        console.log('Started parent notification cron');
        sameDay.length = 0;
        dayBefore.length = 0;
        twoDaysBefore.length = 0;
        threeDaysBefore.length = 0;
        try {
            users = await userModel.getAllParents4Notification(hour);
        } catch (e) {
            email.sendErrorReport(e, 'parent notification cron');
            users = [];
        }
        for (let i = 0; i < users.length; i += 1) {
            if (users[i].alert_days === 0) sameDay.push(users[i]);
            if (users[i].alert_days === 1) dayBefore.push(users[i]);
            if (users[i].alert_days === 2) twoDaysBefore.push(users[i]);
            if (users[i].alert_days === 3) threeDaysBefore.push(users[i]);
        }
        for (let i = 0; i < sameDay.length; i += 1) {
            for (let j = 0; j < todayPosts.length; j += 1) {
                if (sameDay[i].alerts === 'email' && sameDay[i].alert_hour.toString() && (sameDay[i].alert_days.toString()) && ((todayPosts[j].groups.indexOf(sameDay[i].class) !== -1) || sameDay[i].class === 'Adults' || todayPosts[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(todayPosts[j].start_time, sameDay[i].alert_hour)) email.parentNotification(sameDay[i], todayPosts[j]);
                else if (sameDay[i].alerts === 'text' && sameDay[i].alert_hour.toString() && (sameDay[i].alert_days.toString()) && (todayPosts[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || todayPosts[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(todayPosts[j].start_time, sameDay[i].alert_hour)) text.parentNotification(sameDay[i], todayPosts[j]);
            }
            for (let j = 0; j < tomorrow.length; j += 1) {
                if (sameDay[i].alerts === 'email' && sameDay[i].alert_hour.toString() && (sameDay[i].alert_days.toString()) && (tomorrow[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && activityNotificationThreshold(tomorrow[j].start_time, sameDay[i].alert_hour)) email.parentNotification(sameDay[i], tomorrow[j], true);
                else if (sameDay[i].alerts === 'text' && sameDay[i].alert_hour.toString() && (sameDay[i].alert_days.toString()) && (tomorrow[j].groups.indexOf(sameDay[i].class) !== -1 || sameDay[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && activityNotificationThreshold(tomorrow[j].start_time, sameDay[i].alert_hour)) text.parentNotification(sameDay[i], tomorrow[j], true);
            }
        }
        for (let i = 0; i < dayBefore.length; i += 1) {
            for (let j = 0; j < tomorrow.length; j += 1) {
                if (dayBefore[i].alerts === 'email' && dayBefore[i].alert_hour.toString() && dayBefore[i].alert_days && (tomorrow[j].groups.indexOf(dayBefore[i].class) !== -1 || dayBefore[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(tomorrow[j].start_time, dayBefore[i].alert_hour)) email.parentNotification(dayBefore[i], tomorrow[j]);
                else if (dayBefore[i].alerts === 'text' && dayBefore[i].alert_hour.toString() && dayBefore[i].alert_days && (tomorrow[j].groups.indexOf(dayBefore[i].class) !== -1 || dayBefore[i].class === 'Adults' || tomorrow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(tomorrow[j].start_time, dayBefore[i].alert_hour)) text.parentNotification(dayBefore[i], tomorrow[j]);
            }
        }
        for (let i = 0; i < twoDaysBefore.length; i += 1) {
            for (let j = 0; j < twoDaysFromNow.length; j += 1) {
                if (twoDaysBefore[i].alerts === 'email' && twoDaysBefore[i].alert_hour.toString() && twoDaysBefore[i].alert_days && (twoDaysFromNow[j].groups.indexOf(twoDaysBefore[i].class) !== -1 || twoDaysBefore[i].class === 'Adults' || twoDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(twoDaysFromNow[j].start_time, twoDaysBefore[i].alert_hour)) email.parentNotification(twoDaysBefore[i], twoDaysFromNow[j]);
                else if (twoDaysBefore[i].alerts === 'text' && twoDaysBefore[i].alert_hour.toString() && twoDaysBefore[i].alert_days && (twoDaysFromNow[j].groups.indexOf(twoDaysBefore[i].class) !== -1 || twoDaysBefore[i].class === 'Adults' || twoDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(twoDaysFromNow[j].start_time, twoDaysBefore[i].alert_hour)) text.parentNotification(twoDaysBefore[i], twoDaysFromNow[j]);
            }
        }
        for (let i = 0; i < threeDaysBefore.length; i += 1) {
            for (let j = 0; j < threeDaysFromNow.length; j += 1) {
                if (threeDaysBefore[i].alerts === 'email' && threeDaysBefore[i].alert_hour.toString() && threeDaysBefore[i].alert_days && (threeDaysFromNow[j].groups.indexOf(threeDaysBefore[i].class) !== -1 || threeDaysBefore[i].class === 'Adults' || threeDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(threeDaysFromNow[j].start_time, threeDaysBefore[i].alert_hour)) email.parentNotification(threeDaysBefore[i], threeDaysFromNow[j]);
                else if (threeDaysBefore[i].alerts === 'text' && threeDaysBefore[i].alert_hour.toString() && threeDaysBefore[i].alert_days && (threeDaysFromNow[j].groups.indexOf(threeDaysBefore[i].class) !== -1 || threeDaysBefore[i].class === 'Adults' || threeDaysFromNow[i].groups[0] === 'All Young Men') && !activityNotificationThreshold(threeDaysFromNow[j].start_time, threeDaysBefore[i].alert_hour)) text.parentNotification(threeDaysBefore[i], threeDaysFromNow[j]);
            }
        }
        console.log('Notification cron done!');
    },
    start: true,
    timeZone: 'America/Denver',
    runOnInit: false
});

const classSpot = new CronJob({
    cronTime: '00 05 00 * * *',
    onTick: async () => {
        console.log('Started class cron');
        let users = [];
        const tempDate = new Date();
        tempDate.setFullYear(tempDate.getFullYear() - 12);
        tempDate.setHours(0, 0, 0);
        const lowerLimit = tempDate.getTime();
        tempDate.setFullYear(tempDate.getFullYear() - 2);
        const deaconTeacher = tempDate.getTime();
        tempDate.setFullYear(tempDate.getFullYear() - 2);
        const teacherPriest = tempDate.getTime();
        tempDate.setFullYear(tempDate.getFullYear() - 3);
        const upperLimit = tempDate.getTime();
        try {
            users = await userModel.getAllUsers();
        } catch (e) {
            email.sendErrorReport(e, 'classCron get');
        }
        const youth = users.filter((user) => { // eslint-disable-line
            if (user.birthday) {
                let bday = new Date(user.birthday);
                bday = bday.getTime();
                user.bday = bday;
                if (lowerLimit > bday && bday > upperLimit) return user;
            }
        });
        const adults = users.filter((user) => { // eslint-disable-line
            if (user.birthday) {
                let bday = new Date(user.birthday);
                bday = bday.getTime();
                if (upperLimit >= bday) return user;
            }
        });
        for (let i = 0; i < youth.length; i += 1) {
            if (lowerLimit > youth[i].bday && youth[i].bday > deaconTeacher) youth[i].class = 'Deacons';
            else if (deaconTeacher > youth[i].bday && youth[i].bday > teacherPriest) youth[i].class = 'Teachers';
            else if (teacherPriest > youth[i].bday && youth[i].bday > upperLimit) youth[i].class = 'Priests';
            try {
                if (youth[i].class) await userModel.updateUserClass(youth[i]); // eslint-disable-line
            } catch (e) {
                email.sendErrorReport(e, 'classCron update');
            }
        }
        for (let i = 0; i < adults.length; i += 1) {
            adults[i].class = 'Adults';
            await userModel.updateUserClass(adults[i]); // eslint-disable-line
        }
        // Start cron for children class
        console.log('Started children class cron');
        try {
            users = await userModel.getAllChildren();
        } catch (e) {
            email.sendErrorReport(e, 'classCron children get');
            users = [];
        }
        const youth2 = users.filter((user) => { // eslint-disable-line
            if (user.dob) {
                let bday = new Date(user.dob);
                bday = bday.getTime();
                user.bday = bday;
                if (lowerLimit > bday && bday > upperLimit) return user;
            }
        });
        const adults2 = users.filter((user) => { // eslint-disable-line
            if (user.dob) {
                let bday = new Date(user.dob);
                bday = bday.getTime();
                if (upperLimit >= bday) return user;
            }
        });
        for (let i = 0; i < youth2.length; i += 1) {
            if (lowerLimit > youth2[i].bday && youth2[i].bday > deaconTeacher) youth2[i].class = 'Deacons';
            else if (deaconTeacher > youth2[i].bday && youth2[i].bday > teacherPriest) youth2[i].class = 'Teachers';
            else if (teacherPriest > youth2[i].bday && youth2[i].bday > upperLimit) youth2[i].class = 'Priests';
            try {
                if (youth2[i].class) await userModel.updateChildrenClass(youth2[i]); // eslint-disable-line
            } catch (e) {
                email.sendErrorReport(e, 'classCron children update');
            }
        }
        for (let i = 0; i < adults2.length; i += 1) {
            adults2[i].class = 'Adults';
            await userModel.updateChildrenClass(adults2[i]); // eslint-disable-line
        }
        console.log('Class cron done');
    },
    start: true,
    timeZone: 'America/Denver',
    runOnInit: false
});

module.exports = {
    reminders,
    classSpot
};

// if the activity start is earlier then user notification time returns true
const activityNotificationThreshold = (actString, userPref) => {
    if (actString && userPref) {
        let result = 0;
        let hourNotation = null;
        if (actString.length === 7) hourNotation = actString.slice(4);
        else hourNotation = actString.slice(5);
        hourNotation = hourNotation.trim();
        const timeArr = actString.split(':');
        timeArr[1] = timeArr[1].substring(0, 2);
        if (hourNotation.charAt(0) === 'a') {
            if (timeArr[0] === '12') {
                result = 0 + (Number(timeArr[1] / 60));
            } else {
                result = Number(timeArr[0]) + (Number(timeArr[1] / 60));
            }
        } else if (timeArr[0] === '12') {
            result = 12 + (Number(timeArr[1] / 60));
        } else {
            result = 12 + (Number(timeArr[0]) + (Number(timeArr[1] / 60)));
        }
        const test = (result < Number(userPref));
        return test;
    }
    return false;
};
