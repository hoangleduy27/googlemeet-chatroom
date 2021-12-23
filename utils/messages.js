const moment = require('moment');

function formatMessage(username, text, img) {
    return {
        username,
        text,
        img,
        time: moment().format(' hh:mm a')
    };
}

module.exports = formatMessage;