// PostgreSQL Database connection pooling configuration
// This utility handles database connectivity for both local and cloud Postgres instances.

const { Pool } = require('pg');
require('dotenv').config();

// Create a database connection pool.
// Using a Pool is standard practice in production Express applications because
// it reuses active database connections, making database operations much faster.
const isProduction = process.env.NODE_ENV === 'production' 
  || process.env.DATABASE_URL?.includes('neon') 
  || process.env.DATABASE_URL?.includes('render') 
  || process.env.DATABASE_URL?.includes('railway')
  || process.env.DATABASE_URL?.includes('supabase');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If we are connecting to a cloud database (Neon, Render, Railway, Supabase), SSL is mandatory.
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Verify connection during server startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL Database connected successfully at:', res.rows[0].now);
  }
});

// Export the pool query helper for clean execution across the app
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
