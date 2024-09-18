const crypto = require('crypto');
const { promisify } = require('util');

module.exports.generateKey = async (len) =>
  (await promisify(crypto.randomBytes)(Math.ceil((len + 3) / 1.5)))
    .toString('base64')
    .slice(0, len)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

module.exports.generate6Digit = async () =>
  // prettier-ignore
  ('' + parseInt((await promisify(crypto.randomBytes)(3)).toString('hex'), '16')).slice(0,6);
