import React from 'react';
import './LockedFeatureCard.css';

const LockedFeatureCard = ({ title, description }) => {
  return (
    <div className="locked-feature-card">
      <div className="locked-overlay">
        <div className="lock-icon">🔒</div>
        <p className="coming-soon-text">Coming Soon</p>
      </div>
      <div className="locked-content">
        <h3 className="locked-title">{title}</h3>
        <p className="locked-description">{description}</p>
      </div>
    </div>
  );
};

export default LockedFeatureCard;
