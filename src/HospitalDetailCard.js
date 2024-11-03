import React, { useState } from 'react';
import './HospitalDetailCard.css';

const HospitalDetailCard = ({ hospital, onClose }) => {
  const [activeTab, setActiveTab] = useState('Services');

  const { name, type, services = [] } = hospital;

  const formatServiceName = (service) => {
    switch(service) {
      case 'generalservices':
        return 'General Services';
      case 'numberofbeds':
        return 'Number of Beds';
      default:
        return service.charAt(0).toUpperCase() + service.slice(1);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Hospital Type':
        return (
          <div className="hospital-type-content">
            <p><strong>Type:</strong> {type || 'Not specified'}</p>
          </div>
        );
      case 'Services':
        return (
          <ul className="list-disc list-inside max-h-56 overflow-y-auto pr-2">
            {services.length > 0 ? (
              services.map((service, index) => (
                <li key={index}>
                  {formatServiceName(service)}
                </li>
              ))
            ) : (
              <li>No services available for this hospital.</li>
            )}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hospital-detail-card-overlay">
      <div className="hospital-detail-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-button"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="hospital-name">{name}</h2>

        {/* Tabs */}
        <div className="tabs">
          {['Hospital Type', 'Services'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetailCard;