// src/components/DigitalLabel.jsx
// Visual component displaying oil level badges

import React from 'react';

export default function DigitalLabel({ oilLevel, oilMl, size = 'medium' }) {
    const getOilLevelConfig = () => {
        switch (oilLevel) {
            case 'low':
                return {
                    emoji: '🟢',
                    label: 'Low Oil',
                    color: '#10b981',
                    bgColor: '#d1fae5',
                    borderColor: '#6ee7b7',
                };
            case 'medium':
                return {
                    emoji: '🟡',
                    label: 'Medium Oil',
                    color: '#f59e0b',
                    bgColor: '#fef3c7',
                    borderColor: '#fcd34d',
                };
            case 'high':
                return {
                    emoji: '🔴',
                    label: 'High Oil',
                    color: '#ef4444',
                    bgColor: '#fee2e2',
                    borderColor: '#fca5a5',
                };
            default:
                return {
                    emoji: '⚪',
                    label: 'Unknown',
                    color: '#6b7280',
                    bgColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                };
        }
    };

    const config = getOilLevelConfig();
    const sizeClass = size === 'large' ? 'label-large' : size === 'small' ? 'label-small' : 'label-medium';

    return (
        <>
            <div className={`digital-label ${sizeClass}`} style={{ borderColor: config.borderColor }}>
                <div className="label-content" style={{ backgroundColor: config.bgColor }}>
                    <span className="label-emoji">{config.emoji}</span>
                    <div className="label-text">
                        <span className="label-title" style={{ color: config.color }}>
                            {config.label}
                        </span>
                        <span className="label-amount">{oilMl}ml oil</span>
                    </div>
                </div>
            </div>

            <style>{`
        .digital-label {
          display: inline-flex;
          border-radius: 12px;
          border: 2px solid;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .digital-label:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .label-content {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          width: 100%;
        }

        .label-emoji {
          font-size: 24px;
          line-height: 1;
        }

        .label-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .label-title {
          font-size: 14px;
          font-weight: 700;
          line-height: 1.2;
        }

        .label-amount {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        /* Size variants */
        .label-small .label-content {
          padding: 6px 12px;
          gap: 6px;
        }

        .label-small .label-emoji {
          font-size: 18px;
        }

        .label-small .label-title {
          font-size: 12px;
        }

        .label-small .label-amount {
          font-size: 10px;
        }

        .label-large .label-content {
          padding: 14px 20px;
          gap: 14px;
        }

        .label-large .label-emoji {
          font-size: 32px;
        }

        .label-large .label-title {
          font-size: 16px;
        }

        .label-large .label-amount {
          font-size: 14px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .label-medium .label-content {
            padding: 8px 12px;
            gap: 8px;
          }

          .label-medium .label-emoji {
            font-size: 20px;
          }

          .label-medium .label-title {
            font-size: 13px;
          }

          .label-medium .label-amount {
            font-size: 11px;
          }
        }
      `}</style>
        </>
    );
}
