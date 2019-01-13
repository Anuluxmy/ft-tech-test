const moment = require('moment');

const readableTimestamp = (timestamp) => {
  return moment(timestamp).format('MMMM D, YYYY');
};

module.exports = readableTimestamp;
