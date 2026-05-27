-- PostgreSQL database initialization script for Lead Management System (Mini CRM)
-- This file contains SQL queries to create the necessary table and add sample data.

-- 1. Create the Leads table if it doesn't already exist
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Interested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert dummy/seed data for immediate visualization (Optional)
-- This helps beginners see stats and cards working instantly upon database creation!
INSERT INTO leads (name, phone, source, status, created_at)
VALUES 
('John Doe', '9876543210', 'Call', 'Interested', NOW() - INTERVAL '3 days'),
('Jane Smith', '8765432109', 'WhatsApp', 'Converted', NOW() - INTERVAL '2 days'),
('Alice Cooper', '7654321098', 'Field', 'Not Interested', NOW() - INTERVAL '1 day'),
('Bob Marley', '6543210987', 'Call', 'Interested', NOW() - INTERVAL '5 hours'),
('Charlie Puth', '5432109876', 'WhatsApp', 'Converted', NOW() - INTERVAL '2 hours');
