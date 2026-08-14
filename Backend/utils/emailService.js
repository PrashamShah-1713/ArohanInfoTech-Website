const nodemailer = require('nodemailer');

let transporter = null;
let emailConfigValid = false;

const initializeTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[EMAIL] Email credentials not configured. Email sending will be disabled.');
    emailConfigValid = false;
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    emailConfigValid = true;
    console.log('[EMAIL] Transporter initialized successfully');
  } catch (error) {
    console.error('[EMAIL] Failed to initialize transporter:', error.message);
    emailConfigValid = false;
  }
};

// Initialize transporter on module load
initializeTransporter();

async function sendPasswordResetOtpEmail({ to, username, otp }) {
  if (!emailConfigValid || !transporter) {
    throw new Error('Email service is not configured. Please contact support.');
  }

  if (!to) {
    throw new Error('Recipient email address is required');
  }

  try {
    const mailResult = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: 'Arohan InfoTech: Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.7;">
          <h2 style="color: #0f172a;">Hello ${username || 'User'},</h2>
          <p>Your password reset OTP is:</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
          <p>This code is valid for 10 minutes. Use it to verify your identity before setting a new password.</p>
        </div>
      `,
    });

    console.log('[EMAIL] Password reset OTP sent successfully to:', to);
    return { success: true, messageId: mailResult.messageId };
  } catch (error) {
    console.error('[EMAIL] Failed to send password reset OTP:', error.message);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

async function sendInternshipEnrollmentEmail({ to, username, internshipTitle, internshipDuration, startDate, userDetails }) {
  if (!emailConfigValid || !transporter) {
    console.warn('[EMAIL] Email service not configured. Enrollment notification skipped.');
    return { success: true, skipped: true, message: 'Email notification skipped - service not configured' };
  }

  if (!to) {
    console.error('[EMAIL] No recipient email for enrollment notification');
    return { success: false, message: 'No recipient email provided' };
  }

  try {
    const mailResult = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `Arohan InfoTech: Internship Enrollment Confirmed - ${internshipTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.7;">
          <h2 style="color: #0f172a;">Hello ${username || 'Applicant'},</h2>
          <p>Your internship enrollment has been successfully recorded.</p>
          <p><strong>Registered internship:</strong> ${internshipTitle}</p>
          <p><strong>Duration:</strong> ${internshipDuration || 'As per internship listing'}</p>
          <p><strong>Start date:</strong> ${startDate ? new Date(startDate).toLocaleDateString() : 'To be announced'}</p>
          <p><strong>Your details:</strong></p>
          <ul>
            <li>Name: ${userDetails?.name || username || 'N/A'}</li>
            <li>Email: ${userDetails?.email || to}</li>
            <li>Course: ${userDetails?.course || 'N/A'}</li>
            <li>College: ${userDetails?.college || 'N/A'}</li>
          </ul>
          <p>Thank you for choosing Arohan InfoTech. We will contact you shortly with the next steps.</p>
        </div>
      `,
    });

    console.log('[EMAIL] Enrollment email sent successfully to:', to);
    return { success: true, messageId: mailResult.messageId };
  } catch (error) {
    console.error('[EMAIL] Failed to send enrollment email:', error.message);
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}

module.exports = {
  sendPasswordResetOtpEmail,
  sendInternshipEnrollmentEmail,
};
