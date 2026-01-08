// src/components/HealthyAlternatives.jsx
// Displays recommended healthy dish alternatives

import React, { useState } from 'react';

export default function HealthyAlternatives({ alternatives, currentDishName }) {
    const [expandedId, setExpandedId] = useState(null);

    if (!alternatives || alternatives.length === 0) {
        return (
            <div className="no-alternatives">
                <p>No healthier alternatives available at this time.</p>
            </div>
        );
    }

    return (
        <>
            <div className="healthy-alternatives">
                <h3 className="alternatives-title">
                    🌱 Healthier Alternatives to {currentDishName}
                </h3>
                <p className="alternatives-subtitle">
                    Try these lower-oil options for better health
                </p>

                <div className="alternatives-list">
                    {alternatives.map((alt) => (
                        <div
                            key={alt.id}
                            className={`alternative-card ${expandedId === alt.id ? 'expanded' : ''}`}
                            onClick={() => setExpandedId(expandedId === alt.id ? null : alt.id)}
                        >
                            <div className="alternative-header">
                                <div className="alternative-info">
                                    <h4 className="alternative-name">{alt.name}</h4>
                                    <span className="alternative-oil">{alt.oil_ml}ml oil</span>
                                </div>
                                <div className="alternative-score">
                                    <span className="score-value">
                                        {Math.round(alt.relevance_score * 100)}%
                                    </span>
                                    <span className="score-label">match</span>
                                </div>
                            </div>

                            {alt.reason && (
                                <p className="alternative-reason">💡 {alt.reason}</p>
                            )}

                            {expandedId === alt.id && (
                                <div className="alternative-details">
                                    {alt.description && (
                                        <p className="alternative-description">{alt.description}</p>
                                    )}
                                    {alt.benefits && alt.benefits.length > 0 && (
                                        <div className="alternative-benefits">
                                            <strong>Benefits:</strong>
                                            <ul>
                                                {alt.benefits.map((benefit, idx) => (
                                                    <li key={idx}>✓ {benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="alternative-cta">
                                <span className="cta-text">
                                    {expandedId === alt.id ? 'Show less' : 'Learn more'}
                                </span>
                                <span className="cta-arrow">{expandedId === alt.id ? '↑' : '→'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .healthy-alternatives {
          width: 100%;
          margin: 20px 0;
        }

        .alternatives-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .alternatives-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .alternatives-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .alternative-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .alternative-card:hover {
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
          transform: translateY(-2px);
        }

        .alternative-card.expanded {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .alternative-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .alternative-info {
          flex: 1;
        }

        .alternative-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .alternative-oil {
          display: inline-block;
          font-size: 0.85rem;
          color: #10b981;
          background: #d1fae5;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .alternative-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #eff6ff;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .score-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2563eb;
          line-height: 1;
        }

        .score-label {
          font-size: 0.7rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alternative-reason {
          font-size: 0.9rem;
          color: #4b5563;
          margin: 8px 0;
          padding: 8px 12px;
          background: #fef3c7;
          border-radius: 6px;
          border-left: 3px solid #f59e0b;
        }

        .alternative-details {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alternative-description {
          font-size: 0.9rem;
          color: #4b5563;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .alternative-benefits {
          font-size: 0.9rem;
          color: #374151;
        }

        .alternative-benefits strong {
          color: #10b981;
          display: block;
          margin-bottom: 6px;
        }

        .alternative-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .alternative-benefits li {
          padding: 4px 0;
          color: #4b5563;
        }

        .alternative-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2563eb;
        }

        .cta-arrow {
          transition: transform 0.3s ease;
        }

        .alternative-card:hover .cta-arrow {
          transform: translateX(4px);
        }

        .no-alternatives {
          padding: 40px 20px;
          text-align: center;
          background: #f9fafb;
          border-radius: 12px;
          color: #6b7280;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .alternatives-title {
            font-size: 1.2rem;
          }

          .alternatives-subtitle {
            font-size: 0.85rem;
          }

          .alternative-card {
            padding: 12px;
          }

          .alternative-name {
            font-size: 1rem;
          }

          .alternative-header {
            flex-direction: column;
            gap: 10px;
          }

          .alternative-score {
            align-self: flex-start;
          }
        }
      `}</style>
        </>
    );
}
