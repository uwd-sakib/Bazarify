import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ title, description, status }) => {
  const getStatusClass = (status) => {
    if (status === 'Live') return 'status-live';
    if (status.includes('Q')) return 'status-upcoming';
    return 'status-planned';
  };

  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <h3 className="feature-card-title">{title}</h3>
        <span className={`feature-status ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
      <p className="feature-card-description">{description}</p>
    </div>
  );
};

export default FeatureCard;
