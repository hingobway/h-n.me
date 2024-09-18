const mail = require('@sendgrid/mail');
const textversion = require('textversionjs');

const { SENDGRID_KEY } = process.env;

mail.setApiKey(SENDGRID_KEY);

module.exports.sendVerifyEmail = async ({ email, url, code }) => {
  const html = `
Hi there,
<br/><br/>
Use this code to finish logging in:
<br/><br/>
<h3 style="user-select:all;">${code}</h3>
<br/>
Or click this link to log in on <b>this device</b>:
<br/>
<a href="${url}">${url}</a>
<br/><br/>
Both will expire in 30 minutes.
<br/><br/><br/>
Thank you for using <a href="https://www.h-n.me/">h-n.me</a>!
  `;
  try {
    await mail.send({
      to: email,
      from: 'h-n.me <no-reply@h-n.me>',
      subject: 'Verification link for h-n.me',
      html,
      text: textversion(html),
    });
  } catch (error) {
    return error;
  }
};
