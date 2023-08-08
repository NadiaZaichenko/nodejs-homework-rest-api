const validateBody = require('./validateBody');
const isValid = require("./isValidid")
const authenticate = require("./authenticate")
const upload = require("./upload")

module.exports = {
    validateBody,
    isValid,
    authenticate,
    upload,
};