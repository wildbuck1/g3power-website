const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.body);
    const formName = params.get('form-name');
    return { statusCode: 200, body: JSON.stringify({ formName, pass: process.env.GODADDY_SMTP_PASS ? 'set' : 'missing' }) };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
