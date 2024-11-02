const crypto = require('crypto');
const { promisify } = require('util');

module.exports.generateKey = async (len) =>
  (await promisify(crypto.randomBytes)(Math.ceil((len + 3) / 1.5)))
    .toString('base64')
    .slice(0, len)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

module.exports.generateNumerical = async (length) =>
  (
    Array(length).fill(0).join('') +
    parseInt(
      (await promisify(randomBytes)(Math.ceil(length / 2))).toString('hex'),
      16
    )
  ).slice(0 - length);

module.exports.generate6Digit = () => generateNumerical(6);
