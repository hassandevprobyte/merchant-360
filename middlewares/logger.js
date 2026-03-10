const morgan = require("morgan");

morgan.token("message", (req, res) => res.statusMessage || "");

const getIPAddress = () =>
  process.env.NODE_ENV === "production" ? ":remote-addr\t" : "";
const formatString = `${getIPAddress()}:date\t:method\t:url\t:status\t:message\t:response-time ms`;

const logger = morgan(formatString);

module.exports = logger;
