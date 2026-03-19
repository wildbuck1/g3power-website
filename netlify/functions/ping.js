const nodemailer = require('nodemailer');

exports.handler = async () => {
  return { statusCode: 200, body: 'nodemailer loaded: ' + !!nodemailer };
};
