import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEOTags from '../Components/SEOTags.jsx';
import Notification from '../Components/Notification.jsx';
import styles from '../Styles/login.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!username) {
      setNotification({ message: 'Username is required', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/Users/send-otp`, { username }, { withCredentials: true });
      setMessage(response.data.message || 'OTP sent successfully');
      if (response.data.success) {
        setStep(2);
      }
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Unable to send OTP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setNotification({ message: 'OTP is required', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/Users/verify-otp`, { username, otp }, { withCredentials: true });
      setMessage(response.data.message || 'OTP verified successfully');
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setStep(3);
      }
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Unable to verify OTP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !newPassword || !confirmPassword || !resetToken) {
      setNotification({ message: 'All fields are required', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/Users/forgot-password`, {
        username,
        newPassword,
        confirmPassword,
        resetToken,
      }, { withCredentials: true });

      setNotification({ message: response.data.message || 'Password updated successfully', type: 'success' });
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Unable to reset password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <SEOTags
        title="Forgot Password | Arohan InfoTech"
        description="Secure password recovery page for Arohan InfoTech users. Reset your account password with OTP verification."
        keywords="forgot password, reset password, Arohan InfoTech password recovery"
        noindex
      />
      <div className={styles.loginCard}>
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: 'info' })}
        />

        <h1>Reset Password</h1>
        <h2>Verify your account</h2>
        <p>{step === 1 ? 'Enter your username to receive an OTP.' : step === 2 ? 'Enter the OTP sent to your email.' : 'Set your new password.'}</p>

        {message && <p style={{ color: '#0f766e', marginBottom: '12px' }}>{message}</p>}

        {step === 1 && (
          <form className={styles.loginDetails} onSubmit={handleSendOtp}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button className={styles.loginBtn} type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className={styles.loginDetails} onSubmit={handleVerifyOtp}>
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className={styles.loginBtn} type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form className={styles.loginDetails} onSubmit={handleSubmit}>
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className={styles.loginBtn} type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className={styles.signupText} style={{ marginTop: '18px' }}>
          <span>Remembered your password?</span>
          <span className={styles.signupLink} onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
