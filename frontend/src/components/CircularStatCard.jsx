import React from 'react';
import styles from '../pages/Dashboard.module.css';

const CircularStatCard = ({ icon, number, label, color = 'blue' }) => {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statNumber}>{number}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
};

export default CircularStatCard;
