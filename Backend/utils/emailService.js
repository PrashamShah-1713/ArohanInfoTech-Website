const nodemailer = require('nodemailer');

let transporter = null;
let emailConfigValid = false;
let verificationAttempted = false;

const initializeTransporter = async () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log('[EMAIL] Initializing email service...');
  console.log('[EMAIL] EMAIL_USER:', user ? `${user.substring(0, 5)}...` : 'NOT SET');
  console.log('[EMAIL] EMAIL_PASS:', pass ? 'SET' : 'NOT SET');

  if (!user || !pass) {
    console.error('[EMAIL] ❌ Email credentials not configured!');
    console.error('[EMAIL] Required env vars: EMAIL_USER, EMAIL_PASS');
    emailConfigValid = false;
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    
    console.log('[EMAIL] Transport created, verifying connection...');
    
    // Verify the connection
    await transporter.verify();
    emailConfigValid = true;
    verificationAttempted = true;
    console.log('[EMAIL] ✅ Email service initialized and verified successfully');
  } catch (error) {
    console.error('[EMAIL] ❌ Failed to initialize email service:', error.message);
    console.error('[EMAIL] Error details:', error);
    emailConfigValid = false;
    verificationAttempted = true;
  }
};

// Initialize transporter on module load
initializeTransporter().catch((err) => {
  console.error('[EMAIL] Async initialization error:', err);
});

function getEmailStatus() {
  return {
    initialized: transporter !== null,
    valid: emailConfigValid,
    verificationAttempted,
    hasCredentials: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
  };
}

async function sendPasswordResetOtpEmail({ to, username, otp }) {
  const status = getEmailStatus();
  console.log('[EMAIL] sendPasswordResetOtpEmail called', { to, status });

  if (!emailConfigValid || !transporter) {
    const errorMsg = `Email service not configured. Status: ${JSON.stringify(status)}`;
    console.error('[EMAIL] ❌', errorMsg);
    throw new Error(errorMsg);
  }

  if (!to) {
    throw new Error('Recipient email address is required');
  }

  try {
    console.log('[EMAIL] Sending OTP to:', to);
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

    console.log('[EMAIL] ✅ Password reset OTP sent successfully to:', to, 'MessageID:', mailResult.messageId);
    return { success: true, messageId: mailResult.messageId };
  } catch (error) {
    console.error('[EMAIL] ❌ Failed to send password reset OTP:', error.message);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

async function sendInternshipEnrollmentEmail({ to, username, internshipTitle, internshipDuration, startDate, userDetails }) {
  const status = getEmailStatus();
  console.log('[EMAIL] sendInternshipEnrollmentEmail called', { to, status });

  if (!emailConfigValid || !transporter) {
    console.warn('[EMAIL] ⚠️ Email service not configured. Enrollment notification skipped.');
    return { success: true, skipped: true, message: 'Email notification skipped - service not configured' };
  }

  if (!to) {
    console.error('[EMAIL] No recipient email for enrollment notification');
    return { success: false, message: 'No recipient email provided' };
  }

  try {
    console.log('[EMAIL] Sending enrollment email to:', to);
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

    console.log('[EMAIL] ✅ Enrollment email sent successfully to:', to, 'MessageID:', mailResult.messageId);
    return { success: true, messageId: mailResult.messageId };
  } catch (error) {
    console.error('[EMAIL] ❌ Failed to send enrollment email:', error.message);
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}

module.exports = {
  sendPasswordResetOtpEmail,
  sendInternshipEnrollmentEmail,
  getEmailStatus,
};
