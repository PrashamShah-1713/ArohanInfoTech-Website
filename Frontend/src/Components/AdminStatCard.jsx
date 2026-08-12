import React from 'react';
import styles from '../Styles/admin.module.css';

const AdminStatCard = ({ label, value, trend, tone = 'blue', icon }) => {
  const toneClass = {
    blue: styles.toneBlue,
    green: styles.toneGreen,
    purple: styles.tonePurple,
    orange: styles.toneOrange,
  }[tone] || styles.toneBlue;

  return (
    <div className={styles.summaryCard}>
      <div className={`${styles.summaryIcon} ${toneClass}`}>
        {icon}
      </div>

      <div className={styles.summaryInfo}>
        <p className={styles.summaryLabel}>{label}</p>
        <h3 className={styles.summaryValue}>{value}</h3>
        <span className={styles.summaryTrend}>{trend}</span>
      </div>
    </div>
  );
};

export default AdminStatCard;
