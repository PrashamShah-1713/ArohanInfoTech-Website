const crypto = require('crypto');
const User = require('../Models/Users');
const Interns = require('../Models/Inters-students');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendPasswordResetOtpEmail, sendEmailVerificationEmail, getEmailStatus } = require('../utils/emailService');
const secretKey = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'development-only-secret');

if (!secretKey) {
  throw new Error('JWT_SECRET must be configured in production');
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function setuser(user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.userrole || 'user',
    },
    secretKey,
    { expiresIn: '7d' }
  );
}

function getuser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function createUser(req, res) {
  try {
    const { username, useremail, usermobile, userpassword, userconfirmPassword } = req.body;

    if (!username || !useremail || !usermobile || !userpassword || !userconfirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!/^\S+@\S+\.\S+$/.test(useremail)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }

    if (String(userpassword).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    if (userpassword !== userconfirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (!getEmailStatus().valid) {
      return res.status(503).json({ success: false, message: 'Email verification is temporarily unavailable. Please try again later.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { useremail }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already registered' });
    }

    const hashedPassword = await bcrypt.hash(userpassword, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      username,
      useremail,
      usermobile,
      userpassword: hashedPassword,
      userrole: 'user',
      emailVerificationToken: hashToken(verificationToken),
      emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/Users/verify-email?email=${encodeURIComponent(user.useremail)}&token=${verificationToken}`;
    await sendEmailVerificationEmail({ to: user.useremail, username: user.username, verificationUrl });

    return res.status(201).json({
      success: true,
      message: 'Account created. Check your email to verify your account before logging in.',
    });
  } catch (err) {
    console.error('Create user failed:', err);
    const message = err.code === 11000 ? 'Email already registered' : 'Unable to create account';
    return res.status(err.statusCode || 400).json({ success: false, message });
  }
}

async function login(req, res) {
  try {
    const { username, userpassword } = req.body;

    if (!username || !userpassword) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ $or: [{ username }, { useremail: username }] });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    if (user.emailVerified === false) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in' });
    }

    const isMatch = await bcrypt.compare(userpassword, user.userpassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = setuser(user);

    res.cookie('uid', token, cookieOptions);

    res.json({
      success: true,
      message: 'Login success',
      user: {
        _id: user._id,
        username: user.username,
        useremail: user.useremail,
        usermobile: user.usermobile,
        role: user.userrole,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login error' });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, token } = req.query;
    const user = await User.findOne({
      useremail: email,
      emailVerificationToken: hashToken(String(token || '')),
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send('This verification link is invalid or expired.');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;
    await user.save();
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?verified=1`);
  } catch (error) {
    return res.status(500).send('Unable to verify email.');
  }
}

async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = await User.findById(req.user._id).select('-userpassword');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const internships = await Interns.find({ userId: req.user._id })
    .select('appliedInternshipTitle appliedInternshipDuration appliedInternshipStartDate status createdAt')
    .sort({ createdAt: -1 });

  const userData = user.toObject();
  userData.role = user.userrole;
  userData.internships = internships;

  res.json({ success: true, user: userData });
}

async function sendOtp(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const user = await User.findOne({ $or: [{ username }, { useremail: username }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordVerified = false;
    user.resetPasswordToken = null;
    await user.save();

    try {
      await sendPasswordResetOtpEmail({
        to: user.useremail,
        username: user.username,
        otp,
      });
      return res.json({ success: true, message: 'OTP sent to your registered email address' });
    } catch (emailError) {
      console.error('[OTP] Email sending failed:', emailError.message);
      // Clear the OTP if email failed
      user.resetOtp = null;
      user.resetOtpExpiresAt = null;
      await user.save();
      return res.status(500).json({ success: false, message: emailError.message || 'Failed to send OTP. Please try again.' });
    }
  } catch (error) {
    console.error('[OTP] Error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to send OTP' });
  }
}

async function verifyOtp(req, res) {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ success: false, message: 'Username and OTP are required' });
    }

    const user = await User.findOne({ $or: [{ username }, { useremail: username }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentTime = new Date();
    if (!user.resetOtp || !user.resetOtpExpiresAt || user.resetOtpExpiresAt < currentTime) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (String(user.resetOtp) !== String(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetOtp = null;
    user.resetOtpExpiresAt = null;
    user.resetPasswordVerified = true;
    user.resetPasswordToken = hashToken(resetToken);
    await user.save();

    return res.json({ success: true, message: 'OTP verified successfully', resetToken });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to verify OTP' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { username, newPassword, confirmPassword, resetToken } = req.body;

    if (!username || !newPassword || !confirmPassword || !resetToken) {
      return res.status(400).json({ success: false, message: 'Username, new password, confirm password and verification token are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ $or: [{ username }, { useremail: username }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetPasswordVerified || user.resetPasswordToken !== hashToken(resetToken)) {
      return res.status(403).json({ success: false, message: 'Please verify OTP before resetting your password' });
    }

    user.userpassword = await bcrypt.hash(newPassword, 10);
    user.resetPasswordVerified = false;
    user.resetPasswordToken = null;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to update password' });
  }
}

async function updateCurrentUser(req, res) {
  try {
    const { username, useremail } = req.body;

    if (!username || !useremail) {
      return res.status(400).json({ success: false, message: 'Username and email are required' });
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingUsername = await User.findOne({ username, _id: { $ne: currentUser._id } });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already in use' });
    }

    const existingEmail = await User.findOne({ useremail, _id: { $ne: currentUser._id } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    currentUser.username = username;
    currentUser.useremail = useremail;
    await currentUser.save();

    const internships = await Interns.find({ userId: req.user._id })
      .select('appliedInternshipTitle appliedInternshipDuration appliedInternshipStartDate status createdAt')
      .sort({ createdAt: -1 });

    const userData = currentUser.toObject();
    userData.internships = internships;

    return res.json({ success: true, message: 'Profile updated successfully', user: userData });
  } catch (error) {
    const duplicateError = error.code === 11000 ? 'Email or username already registered' : 'Unable to update profile';
    return res.status(500).json({ success: false, message: duplicateError });
  }
}

function logout(req, res) {
  res.clearCookie('uid', {
    ...cookieOptions,
    maxAge: undefined,
  });

  res.json({ success: true, message: 'Logged out successfully' });
}

module.exports = {
  createUser,
  login,
  verifyEmail,
  setuser,
  getuser,
  getCurrentUser,
  updateCurrentUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  logout,
};
