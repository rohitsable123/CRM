import React from 'react';

/**
 * Dashboard Component
 * Dynamically computes and displays lead statistics based on the current active lead list.
 * 
 * @param {Array} props.leads - List of all leads currently loaded
 */
export default function Dashboard({ leads }) {
  // Calculate metrics using standard JavaScript array filters
  const totalLeads = leads.length;
  
  const interestedLeads = leads.filter(lead => lead.status === 'Interested').length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const notInterestedLeads = leads.filter(lead => lead.status === 'Not Interested').length;

  return (
    <section className="dashboard-grid" aria-label="CRM Dashboard Metrics">
      {/* 1. Total Leads Card */}
      <div className="stat-card total">
        <div className="stat-icon-wrapper" aria-hidden="true">👥</div>
        <div className="stat-info">
          <span className="stat-value">{totalLeads}</span>
          <span className="stat-label">Total Leads</span>
        </div>
      </div>

      {/* 2. Interested Leads Card */}
      <div className="stat-card interested">
        <div className="stat-icon-wrapper" aria-hidden="true">⭐</div>
        <div className="stat-info">
          <span className="stat-value">{interestedLeads}</span>
          <span className="stat-label">Interested</span>
        </div>
      </div>

      {/* 3. Converted Leads Card */}
      <div className="stat-card converted">
        <div className="stat-icon-wrapper" aria-hidden="true">✅</div>
        <div className="stat-info">
          <span className="stat-value">{convertedLeads}</span>
          <span className="stat-label">Converted</span>
        </div>
      </div>

      {/* 4. Not Interested Leads Card */}
      <div className="stat-card not-interested">
        <div className="stat-icon-wrapper" aria-hidden="true">❌</div>
        <div className="stat-info">
          <span className="stat-value">{notInterestedLeads}</span>
          <span className="stat-label">Not Interested</span>
        </div>
      </div>
    </section>
  );
}
