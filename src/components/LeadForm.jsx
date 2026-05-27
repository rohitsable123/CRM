import React, { useState } from 'react';

/**
 * LeadForm Component
 * Renders a card containing a lead entry form with front-end validation.
 * 
 * @param {Function} props.onAddLead - Parent handler callback to submit verified lead to DB
 * @param {Boolean} props.submitting - Whether an API request is currently in flight
 */
export default function LeadForm({ onAddLead, submitting }) {
  // Form input states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('Call'); // Default source selection

  // Error validation states
  const [errors, setErrors] = useState({});

  // Input sanitization and phone validation regex
  const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

  const validateForm = () => {
    const tempErrors = {};
    
    if (!name.trim()) {
      tempErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim().replace(/[\s-]/g, ''))) {
      tempErrors.phone = 'Enter a valid phone number (at least 10 digits)';
    }

    if (!source) {
      tempErrors.source = 'Source selection is required';
    }

    setErrors(tempErrors);
    
    // Form is valid if errors object remains empty
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Send data to parent handler
      onAddLead({ name, phone, source });
      
      // Reset state upon successful submission
      setName('');
      setPhone('');
      setSource('Call');
      setErrors({});
    }
  };

  return (
    <div className="form-card">
      <h2>➕ Add New Lead</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* 1. Name Field */}
        <div className="form-group">
          <label htmlFor="name-input">Full Name</label>
          <input
            id="name-input"
            type="text"
            className="form-input"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            required
          />
          {errors.name && <p className="input-error-msg">{errors.name}</p>}
        </div>

        {/* 2. Phone Field */}
        <div className="form-group">
          <label htmlFor="phone-input">Phone Number</label>
          <input
            id="phone-input"
            type="tel"
            className="form-input"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            required
          />
          {errors.phone && <p className="input-error-msg">{errors.phone}</p>}
        </div>

        {/* 3. Source Selection (Premium Click Pills) */}
        <div className="form-group">
          <label>Lead Source</label>
          <div className="source-pills">
            {['Call', 'WhatsApp', 'Field'].map((option) => (
              <button
                key={option}
                type="button"
                className={`source-pill ${source === option ? 'active' : ''}`}
                onClick={() => setSource(option)}
                disabled={submitting}
              >
                {option === 'Call' && '📞 '}
                {option === 'WhatsApp' && '💬 '}
                {option === 'Field' && '🏃‍♂️ '}
                {option}
              </button>
            ))}
          </div>
          {errors.source && <p className="input-error-msg">{errors.source}</p>}
        </div>

        {/* 4. Submit Button */}
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
              Saving Lead...
            </>
          ) : (
            'Submit Lead'
          )}
        </button>
      </form>
    </div>
  );
}
