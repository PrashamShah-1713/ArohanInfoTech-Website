import React, { useState } from "react";
import axios from "axios";
import SEOTags from "../Components/SEOTags.jsx";
import Notification from "../Components/Notification.jsx";
import styles from "../Styles/CreateAccount.module.css";

const CreateAccount = () => {
  const [username, setusername] = useState("");
  const [useremail, setuseremail] = useState("");
  const [usermobile, setusermobile] = useState("");
  const [userpassword, setuserpassword] = useState("");
  const [userconfirmPassword, setuserconfirmPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "info" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userpassword !== userconfirmPassword) {
      setNotification({ message: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/Users`,
        {
          username,
          useremail,
          usermobile,
          userpassword,
          userconfirmPassword,
        },
        { withCredentials: true }
      );

      setNotification({ message: response.data.message || "Account created successfully", type: "success" });
      if (response.data.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      setNotification({ message: err.response?.data?.message || "Unable to create account", type: "error" });
    }
  };

  return (
    <div className={styles.createAccountPage}>
      <SEOTags
        title="Create Account | Arohan InfoTech"
        description="Register with Arohan InfoTech to access internships, training, and personalized software services."
        keywords="Arohan InfoTech signup, create account, user registration"
        noindex
      />
      <div className={styles.createAccountContainer}>
        <h1>Create Account</h1>
        <p>Join Arohan InfoTech and start your journey.</p>

        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "info" })}
        />

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            placeholder="Enter your full name"
          />

          <label htmlFor="useremail">Email</label>
          <input
            type="email"
            name="useremail"
            id="useremail"
            value={useremail}
            onChange={(e) => setuseremail(e.target.value)}
            placeholder="Enter your email"
          />

          <label htmlFor="usermobile">Mobile Number</label>
          <input
            type="tel"
            name="usermobile"
            id="usermobile"
            value={usermobile}
            onChange={(e) => setusermobile(e.target.value)}
            placeholder="Enter your mobile number"
          />

          <label htmlFor="userpassword">Password</label>
          <input
            type="password"
            name="userpassword"
            id="userpassword"
            value={userpassword}
            onChange={(e) => setuserpassword(e.target.value)}
            placeholder="Enter your password"
          />

          <label htmlFor="userconfirmPassword">Confirm Password</label>
          <input
            type="password"
            name="userconfirmPassword"
            id="userconfirmPassword"
            value={userconfirmPassword}
            onChange={(e) => setuserconfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;