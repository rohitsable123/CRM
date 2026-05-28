// Main Express Server Entry Point - Unified Root
// This file defines all REST APIs, validation logic, and routing for our CRM.
// It is designed to be highly readable and beginner-friendly!

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database client query helper from root directory
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our React frontend running on another port (e.g. 5173) to securely call this API.
app.use(cors());

// Express built-in middleware to parse JSON request bodies
app.use(express.json());

// Log incoming requests (Useful for debugging/learning)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request received at ${req.url}`);
  next();
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. GET ALL LEADS (Supports Search & Filtering)
// Endpoint: GET /api/leads?search=John&source=Call&status=Interested
app.get('/api/leads', async (req, res, next) => {
  try {
    const { search, source, status } = req.query;

    let queryText = 'SELECT * FROM leads';
    const queryParams = [];
    const conditions = [];

    // Filter by search (name or phone)
    if (search && search.trim() !== '') {
      queryParams.push(`%${search.trim()}%`);
      const paramIndex = queryParams.length;
      conditions.push(`(name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`);
    }

    // Filter by source (Call, WhatsApp, Field)
    if (source && source.trim() !== '') {
      queryParams.push(source.trim());
      const paramIndex = queryParams.length;
      conditions.push(`source = $${paramIndex}`);
    }

    // Filter by status (Interested, Not Interested, Converted)
    if (status && status.trim() !== '') {
      queryParams.push(status.trim());
      const paramIndex = queryParams.length;
      conditions.push(`status = $${paramIndex}`);
    }

    // Build the query string dynamically
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    // Sort leads to show the newest ones first
    queryText += ' ORDER BY created_at DESC';

    // Execute safe parameterized query
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    next(error); // Pass database errors to our custom error handler
  }
});

// 2. ADD A LEAD
// Endpoint: POST /api/leads
// Request Body: { "name": "John Doe", "phone": "1234567890", "source": "Call" }
app.post('/api/leads', async (req, res, next) => {
  try {
    const { name, phone, source } = req.body;

    // Simple Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!source || !['Call', 'WhatsApp', 'Field'].includes(source)) {
      return res.status(400).json({ error: 'Source must be Call, WhatsApp, or Field' });
    }

    // Check if a lead with the same phone number already exists
    const checkPhoneQuery = 'SELECT id FROM leads WHERE phone = $1';
    const existingLead = await db.query(checkPhoneQuery, [phone.trim()]);
    if (existingLead.rows.length > 0) {
      return res.status(400).json({ error: 'Lead already added with same number' });
    }

    // Insert new lead into the database.
    // Default status is 'Interested'. Parameterized query protects against SQL injection.
    const queryText = `
      INSERT INTO leads (name, phone, source, status) 
      VALUES ($1, $2, $3, 'Interested') 
      RETURNING *
    `;
    const result = await db.query(queryText, [name.trim(), phone.trim(), source]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 3. UPDATE LEAD STATUS
// Endpoint: PUT /api/leads/:id
// Request Body: { "status": "Converted" }
app.put('/api/leads/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate if the requested status is valid
    const validStatuses = ['Interested', 'Not Interested', 'Converted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const queryText = `
      UPDATE leads 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await db.query(queryText, [status, id]);

    // If result rows count is 0, the lead with this ID does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 4. DELETE A LEAD
// Endpoint: DELETE /api/leads/:id
app.delete('/api/leads/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const queryText = 'DELETE FROM leads WHERE id = $1 RETURNING *';
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully', lead: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

// Global catch-all handler for async errors.
// This prevents raw system error messages or db stack traces from leaking to users.
app.use((err, req, res, next) => {
  console.error('❌ Server Error Details:', err.stack || err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on our end.' 
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 CRM Backend Server running at http://localhost:${PORT}`);
});
