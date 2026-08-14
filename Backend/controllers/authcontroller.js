const crypto = require('crypto');
const User = require('../Models/Users');
const Interns = require('../Models/Inters-students');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendPasswordResetOtpEmail } = require('../utils/emailService');
const secretKey = process.env.JWT_SECRET || 'ShriGanesh11@ArohanInfoTech';

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

    if (userpassword !== userconfirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { useremail }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already registered' });
    }

    const hashedPassword = await bcrypt.hash(userpassword, 10);

    const user = await User.create({
      username,
      useremail,
      usermobile,
      userpassword: hashedPassword,
      userrole: 'user',
    });

    const token = setuser(user);

    res.cookie('uid', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully and logged in',
      user: {
        _id: user._id,
        username: user.username,
        useremail: user.useremail,
        usermobile: user.usermobile,
        role: user.userrole,
      },
    });
  } catch (err) {
    const message = err.code === 11000 ? 'Email already registered' : 'Unable to create account';
    res.status(400).json({ success: false, message });
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

    const isMatch = await bcrypt.compare(userpassword, user.userpassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = setuser(user);

    res.cookie('uid', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    await sendPasswordResetOtpEmail({
      to: user.useremail,
      username: user.username,
      otp,
    });

    return res.json({ success: true, message: 'OTP sent to your registered email address' });
  } catch (error) {
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
    user.resetPasswordToken = resetToken;
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

    const user = await User.findOne({ $or: [{ username }, { useremail: username }] });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetPasswordVerified || user.resetPasswordToken !== resetToken) {
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
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  res.json({ success: true, message: 'Logged out successfully' });
}

module.exports = {
  createUser,
  login,
  setuser,
  getuser,
  getCurrentUser,
  updateCurrentUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  logout,
};
