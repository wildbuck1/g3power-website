const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.body);

    if (params.get('form-name') !== 'gc-bid-list') return { statusCode: 200 };

    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@g3pwr.com',
        pass: process.env.GODADDY_SMTP_PASS,
      },
    });

    const gcCompany   = params.get('gc-company')       || 'Your Company';
    const gcContact   = params.get('gc-contact')       || '';
    const gcEmail     = params.get('gc-email')         || '';
    const gcPhone     = params.get('gc-phone')         || '—';
    const projectType = params.get('gc-project-type')  || '—';
    const location    = params.get('gc-location')      || '—';
    const message     = params.get('gc-message')       || '—';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    // ── 1. Auto-reply to GC ──────────────────────────────────────────
    if (gcEmail) {
      await transporter.sendMail({
        from: '"G3 Power" <contact@g3pwr.com>',
        to: gcEmail,
        subject: `G3 Power — You're on our bid list`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
            <div style="background:#07152E;padding:28px 32px;">
              <p style="color:#39FF14;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px;">G3 Power</p>
              <p style="color:#fff;font-size:22px;font-weight:700;margin:0;">You're on our bid list.</p>
            </div>
            <div style="padding:28px 32px;border:1px solid #e5e7eb;border-top:none;">
              <p>Hi ${gcContact || gcCompany},</p>
              <p>We received your request and have added <strong>${gcCompany}</strong> to our bid list. We'll reach out within one business day to follow up on upcoming projects.</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
                <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;width:40%;">Project Type</td><td style="padding:8px 0;font-weight:600;">${projectType}</td></tr>
                <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Location</td><td style="padding:8px 0;font-weight:600;">${location}</td></tr>
              </table>
              <p>In the meantime, feel free to call or email us directly.</p>
              <div style="margin:24px 0;">
                <a href="tel:+12094706983" style="background:#07152E;color:#39FF14;text-decoration:none;padding:12px 24px;font-weight:700;font-size:14px;letter-spacing:1px;display:inline-block;">CALL (209) 470-6983</a>
              </div>
              <p style="color:#888;font-size:13px;">CA C-10 License #1149483 &nbsp;·&nbsp; contact@g3pwr.com &nbsp;·&nbsp; Stockton, CA</p>
            </div>
          </div>
        `,
      });
    }

    // ── 2. Notification to Raul ──────────────────────────────────────
    await transporter.sendMail({
      from: '"G3 Power Website" <contact@g3pwr.com>',
      to: 'contact@g3pwr.com',
      subject: `New Bid List Request — ${gcCompany}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
          <div style="background:#07152E;padding:20px 28px;">
            <p style="color:#39FF14;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">New Lead — gc.html</p>
            <p style="color:#fff;font-size:20px;font-weight:700;margin:0;">${gcCompany}</p>
          </div>
          <div style="padding:24px 28px;border:1px solid #e5e7eb;border-top:none;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;width:36%;">Contact</td><td style="padding:8px 0;font-weight:600;">${gcContact}</td></tr>
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${gcEmail}">${gcEmail}</a></td></tr>
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;"><a href="tel:${gcPhone}">${gcPhone}</a></td></tr>
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Project Type</td><td style="padding:8px 0;">${projectType}</td></tr>
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Location</td><td style="padding:8px 0;">${location}</td></tr>
              <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#666;">Notes</td><td style="padding:8px 0;">${message}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Submitted</td><td style="padding:8px 0;color:#888;">${submittedAt} PT</td></tr>
            </table>
          </div>
        </div>
      `,
    });

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('send-email error:', err);
    return { statusCode: 500, body: err.message };
  }
};
