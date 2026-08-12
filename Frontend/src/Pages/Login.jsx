import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/login.module.css";
import SEOTags from "../Components/SEOTags.jsx";
import Notification from "../Components/Notification.jsx";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "info" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/Users/login`,
        { username, userpassword },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        if (response.data.user.role?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setNotification({ message: response.data.message || "Login failed", type: "error" });
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.message || "Unable to login", type: "error" });
    }
  };

  return (
    <div className={styles.loginPage}>
      <SEOTags
        title="Login | Arohan InfoTech"
        description="Secure login for Arohan InfoTech users to access internships, projects, and the admin dashboard."
        keywords="Arohan InfoTech login, user login, admin login"
        noindex
      />
      <div className={styles.loginOverlay}>
        <div className={styles.loginCard}>
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: "", type: "info" })}
          />

          <div className={styles.popupHeader}>
            <div className={styles.popupBadge}>🔐</div>
            <div>
              <h1>Namaste 🙏</h1>
              <h2>Welcome to Arohan InfoTech</h2>
            </div>
          </div>
          <p>Login to access internships, courses and your dashboard.</p>

          <form className={styles.loginDetails} onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={userpassword}
            onChange={(e) => setUserpassword(e.target.value)}
          />

          <button className={styles.loginBtn} type="submit">
            Login
          </button>
        </form>

        <div className={styles.utilityRow}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => navigate('/forgot-password')}
          >
            <br></br>
            Forgot password?
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

          <div className={styles.signupText}>
            <span>Don't have an account?</span>
            <span
              className={styles.signupLink}
              onClick={() => {
                navigate('/create-account');
              }}
            >
              Create Account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;