import React from 'react';
import styles from '../pages/Dashboard.module.css';

const AlertNotice = ({ icon = '⚠️', text }) => {
  return (
    <div className={styles.alertSection}>
      <div className={styles.alertIcon}>{icon}</div>
      <div className={styles.alertText}>{text}</div>
    </div>
  );
};

export default AlertNotice;
