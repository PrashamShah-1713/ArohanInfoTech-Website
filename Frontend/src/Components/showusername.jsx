import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import styles from '../Styles/showusername.module.css';

const ShowUsername = () => {
  const { user } = useContext(AuthContext);

  if (!user?.username) {
    return null;
  }

  return (
    <div className={styles.userBadge}>
      <span className={styles.userBadgeIcon}>👤</span>
      <span className={styles.userBadgeText}>{user.username}</span>
    </div>
  );
};

export default ShowUsername;