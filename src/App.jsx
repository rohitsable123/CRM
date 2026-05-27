import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';

// Backend server API URL setup
// Supports cloud deployment VITE_API_URL or falls back to standard local ports
const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (window.location.origin.includes('5173') ? 'http://localhost:5000/api' : '/api');


export default function App() {
  // --- CORE STATE ---
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // --- FILTER & SEARCH STATE ---
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // --- NOTIFICATIONS (TOASTS) STATE ---
  const [toasts, setToasts] = useState([]);

  // Helper function to display temporary success/error alerts
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically fade out after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  // --- API CALLS (fetch) ---

  // 1. Fetch leads from database with active search & filters
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build dynamic query parameters
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search);
      if (sourceFilter) params.append('source', sourceFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`${API_BASE_URL}/leads?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the API server. Please make sure the backend is running.');
      showToast('Error syncing with database!', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, sourceFilter, statusFilter, showToast]);

  // 2. Add lead handler
  const handleAddLead = async (newLead) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add lead');
      }

      const savedLead = await response.json();
      
      // Update UI state instantly
      setLeads((prevLeads) => [savedLead, ...prevLeads]);
      showToast('Lead added successfully!', 'success');
      
      // If we had active filters, refresh list to ensure accuracy
      if (search || sourceFilter || statusFilter) {
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error inserting lead record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Update lead status handler
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }

      const updatedLead = await response.json();

      // Reflect change in local React state instantly
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === id ? updatedLead : lead))
      );
      showToast(`Status updated to ${newStatus}!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error updating lead status', 'error');
    }
  };

  // 4. Delete lead handler
  const handleDeleteLead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      // Remove from active React state instantly
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      showToast('Lead deleted successfully!', 'warning');
    } catch (err) {
      console.error(err);
      showToast('Error deleting lead from record', 'error');
    }
  };

  // --- DEBOUNCED SEARCH & AUTO-REFRESH ---
  useEffect(() => {
    // 300ms Debounce prevents database hammer when typing search inputs
    const delayDebounce = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, sourceFilter, statusFilter, fetchLeads]);

  // Handler to clear search term and dropdown selections
  const handleClearFilters = () => {
    setSearch('');
    setSourceFilter('');
    setStatusFilter('');
    showToast('Filters cleared!', 'success');
  };

  return (
    <main className="app-container">
      {/* 1. APP HEADER */}
      <header className="app-header">
        <div className="brand-section">
          <h1>LeadFlow CRM</h1>
          <p>Full Stack Lead & Sales Funnel Management System</p>
        </div>
        <div className="sync-status">
          <span className="status-dot"></span>
          <span>Live Sync DB</span>
        </div>
      </header>

      {/* 2. DASHBOARD CARDS */}
      <Dashboard leads={leads} />

      {/* 3. CORE INTERFACE CONTAINER */}
      <div className="main-content-grid">
        {/* Left Side: Add Lead Form Card */}
        <aside>
          <LeadForm onAddLead={handleAddLead} submitting={submitting} />
        </aside>

        {/* Right Side: Filters and Table Records */}
        <section className="leads-section" aria-label="CRM Lead Records Panel">
          {/* Filters Bar */}
          <div className="filter-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search input"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-selects">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="filter-select"
                aria-label="Filter by Source"
              >
                <option value="">All Sources</option>
                <option value="Call">📞 Call</option>
                <option value="WhatsApp">💬 WhatsApp</option>
                <option value="Field">🏃‍♂️ Field</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
                aria-label="Filter by Status"
              >
                <option value="">All Statuses</option>
                <option value="Interested">⭐ Interested</option>
                <option value="Converted">✅ Converted</option>
                <option value="Not Interested">❌ Not Interested</option>
              </select>
            </div>

            {/* Clear Button */}
            {(search || sourceFilter || statusFilter) && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Reset
              </button>
            )}
          </div>

          {/* Leads table or list details */}
          {error ? (
            <div className="error-state">
              <h3>Connection Failure</h3>
              <p>{error}</p>
            </div>
          ) : (
            <LeadList
              leads={leads}
              loading={loading}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDeleteLead}
            />
          )}
        </section>
      </div>

      {/* 4. FLOATING TOAST NOTIFICATIONS POPUP */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' && '✅ '}
              {toast.type === 'error' && '❌ '}
              {toast.type === 'warning' && '⚠️ '}
              {toast.message}
            </span>
            <button 
              className="toast-close" 
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
