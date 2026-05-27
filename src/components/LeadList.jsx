import React, { useState } from 'react';

/**
 * LeadList Component
 * Renders lead records in a premium responsive table for desktop,
 * and elegant cards for mobile viewport dimensions.
 * Includes loading, empty, and confirm-delete overlays.
 * 
 * @param {Array} props.leads - Loaded leads list
 * @param {Boolean} props.loading - Indicates API fetches are in flight
 * @param {Function} props.onStatusUpdate - Updates status of lead on DB
 * @param {Function} props.onDelete - Deletes lead on DB
 */
export default function LeadList({ leads, loading, onStatusUpdate, onDelete }) {
  // Tracks ID of the lead currently showing the inline confirmation overlay
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Format timestamp helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Helper to choose select input class color matching active status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Interested': return 'select-interested';
      case 'Converted': return 'select-converted';
      case 'Not Interested': return 'select-not-interested';
      default: return '';
    }
  };

  // Loading Spinner State
  if (loading && leads.length === 0) {
    return (
      <div className="table-card" style={{ padding: '2rem 0' }}>
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Syncing database records...</p>
        </div>
      </div>
    );
  }

  // Empty Lead Records State
  if (leads.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <span className="empty-icon" role="img" aria-label="empty leads">📁</span>
          <h3>No Leads Found</h3>
          <p>Try clearing filters or add a new lead using the form on the left.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-section">
      {/* ==============================================
          DESKTOP TABLE LAYOUT
          ============================================== */}
      <div className="table-card">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead Info</th>
              <th>Source</th>
              <th>Created Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                {/* A. Lead Info Column */}
                <td>
                  <div className="lead-name">{lead.name}</div>
                  <div className="lead-phone">📞 {lead.phone}</div>
                </td>
                
                {/* B. Source Badge Column */}
                <td>
                  <span className="source-badge">
                    {lead.source === 'Call' && '📞 '}
                    {lead.source === 'WhatsApp' && '💬 '}
                    {lead.source === 'Field' && '🏃‍♂️ '}
                    {lead.source}
                  </span>
                </td>
                
                {/* C. Created Date Column */}
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {formatDate(lead.created_at)}
                </td>
                
                {/* D. Status Selection Column */}
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusUpdate(lead.id, e.target.value)}
                    className={`status-select ${getStatusClass(lead.status)}`}
                  >
                    <option value="Interested">⭐ Interested</option>
                    <option value="Converted">✅ Converted</option>
                    <option value="Not Interested">❌ Not Interested</option>
                  </select>
                </td>
                
                {/* E. Action Buttons Column */}
                <td style={{ textAlign: 'right' }}>
                  {confirmDeleteId === 0 || confirmDeleteId === lead.id ? (
                    <div className="delete-confirm-box" style={{ display: 'inline-flex' }}>
                      <span>Sure?</span>
                      <div className="confirm-actions">
                        <button
                          onClick={() => {
                            onDelete(lead.id);
                            setConfirmDeleteId(null);
                          }}
                          className="confirm-yes-btn"
                          aria-label="Confirm delete"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="confirm-no-btn"
                          aria-label="Cancel delete"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(lead.id)}
                      className="delete-btn"
                      title="Delete Lead"
                      aria-label={`Delete ${lead.name}`}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==============================================
          MOBILE CARD LAYOUT (Shown under 768px via media queries)
          ============================================== */}
      <div className="leads-cards-container">
        {leads.map((lead) => (
          <div key={lead.id} className="lead-mobile-card">
            {/* Header: Name and Status */}
            <div className="lead-mobile-header">
              <div>
                <div className="lead-name" style={{ fontSize: '1.05rem' }}>{lead.name}</div>
                <div className="lead-phone" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
                  📞 {lead.phone}
                </div>
              </div>
              <span className="source-badge">
                {lead.source === 'Call' && '📞 '}
                {lead.source === 'WhatsApp' && '💬 '}
                {lead.source === 'Field' && '🏃‍♂️ '}
                {lead.source}
              </span>
            </div>

            {/* Date Details */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Added: {formatDate(lead.created_at)}
            </div>

            {/* Footer Actions and Status Select */}
            <div className="lead-mobile-footer">
              <select
                value={lead.status}
                onChange={(e) => onStatusUpdate(lead.id, e.target.value)}
                className={`status-select ${getStatusClass(lead.status)}`}
                style={{ padding: '0.3rem 1.5rem 0.3rem 0.5rem', fontSize: '0.8rem' }}
              >
                <option value="Interested">⭐ Interested</option>
                <option value="Converted">✅ Converted</option>
                <option value="Not Interested">❌ Not Interested</option>
              </select>

              {confirmDeleteId === lead.id ? (
                <div className="delete-confirm-box">
                  <span>Confirm?</span>
                  <div className="confirm-actions">
                    <button
                      onClick={() => {
                        onDelete(lead.id);
                        setConfirmDeleteId(null);
                      }}
                      className="confirm-yes-btn"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="confirm-no-btn"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(lead.id)}
                  className="delete-btn"
                  aria-label={`Delete ${lead.name}`}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
