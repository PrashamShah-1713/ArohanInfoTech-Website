const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

async function sendPasswordResetOtpEmail({ to, username, otp }) {
  const transporter = createTransporter();

  if (!transporter || !to) {
    console.log('[EMAIL] Simulated password reset OTP email', { to, username, otp });
    return { success: true, simulated: true };
  }

  const mail = await transporter.sendMail({
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

  return { success: true, messageId: mail.messageId };
}

async function sendInternshipEnrollmentEmail({ to, username, internshipTitle, internshipDuration, startDate, userDetails }) {
  const transporter = createTransporter();

  if (!transporter || !to) {
    console.log('[EMAIL] Simulated internship enrollment email', {
      to,
      username,
      internshipTitle,
      internshipDuration,
      startDate,
      userDetails,
    });
    return { success: true, simulated: true };
  }

  const mail = await transporter.sendMail({
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

  return { success: true, messageId: mail.messageId };
}

module.exports = {
  sendPasswordResetOtpEmail,
  sendInternshipEnrollmentEmail,
};
