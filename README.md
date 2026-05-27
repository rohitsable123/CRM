# LeadFlow CRM - Simple Full Stack Lead Management System (Mini CRM)

LeadFlow CRM is a modern, lightweight, and fully functional **Full Stack Lead Management System (Mini CRM)**. It is built using **React.js** on the frontend, **Node.js & Express.js** on the backend, and a **PostgreSQL** database.

This project is specifically designed to be **beginner-friendly, production-ready, cleanly structured, and extremely easy to run**. 

---

## 📸 Premium Design Aesthetics & User Interface
The frontend boasts an ultra-modern, HubSpot-style premium dashboard featuring:
*   **Dynamic Analytics Cards:** Auto-calculates metrics in real time (Total, Interested, Converted, and Not Interested leads).
*   **Active Validation Entry Form:** Validates name, phone format, and lead source inline before submissions.
*   **Interactive Leads Table:** Provides clean dropdown status updating, live list sync, and beautiful status badges.
*   **Mobile-Ready Cards:** Seamless transition from desktop tables into beautiful mobile cards under screen widths of 768px.
*   **In-Place Deletion Confirmation:** Avoids blocking browser alerts with instant inline "Yes/No" delete prompts.
*   **Feedback System:** Clean CSS transitions, loading spinner, and customized animated toast notifications.

---

## 🛠️ Technology Stack
*   **Frontend:** React.js (Vite environment), Vanilla CSS (custom design system)
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (with parameterized query security)
*   **HTTP Requests:** Standard browser `fetch()` API
*   **Dev Utilities:** `nodemon` (auto-reloading), `dotenv` (environment configuration), `cors` (cross-origin compatibility)

---

## 📂 Beginner-Friendly Project Structure
Rather than nesting file configurations across multiple deep folders, this application uses a consolidated, flat file layout to make it very easy for beginners to trace data flow from the database to the screen:

```text
Lead Management System(CRM)/
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/         # Reusable dashboard UI parts
│   │   │   ├── Dashboard.jsx   # Metrics stats cards
│   │   │   ├── LeadForm.jsx    # Add lead card + validators
│   │   │   └── LeadList.jsx    # Desktop Table & Mobile Cards grid
│   │   ├── App.jsx             # Main App layout, search/filters, & API fetch logic
│   │   ├── index.css           # Premium Custom Design system styling
│   │   └── main.jsx            # Entry point mounting React
│   ├── package.json            # React & Vite build configurations
│   └── vite.config.js          
├── server/                     # Express Backend App
│   ├── db.js                   # Simple database connection pool (pg.Pool)
│   ├── server.js               # APIs, routing, validation, error middleware
│   ├── .env                    # Secret database & Port credentials
│   ├── .env.example            # Environment variables placeholder
│   └── package.json            # Backend Node packages & dev scripts
├── schema.sql                  # PostgreSQL DB Schema setup and seed data
└── README.md                   # Complete developer manual (This file!)
```

---

## ⚡ Quick Start & Installation

### Prerequisite
Ensure you have **Node.js** (v16+) and **PostgreSQL** installed locally on your system.

---

### Step 1: Database Setup
1. Open your PostgreSQL terminal (or tools like pgAdmin / DBeaver).
2. Create a new database named `lead_db`:
   ```sql
   CREATE DATABASE lead_db;
   ```
3. Connect to your database and execute the query inside [schema.sql](./schema.sql) to set up the leads table and load mock seed data:
   ```bash
   # In terminal or using your favorite GUI tool, run:
   psql -U postgres -d lead_db -f schema.sql
   ```

---

### Step 2: Configure Backend Environment
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file (you can copy [.env.example](./server/.env.example)):
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lead_db
   ```
   *Note: Adjust `postgres:postgres` in the connection string to match your local database username and password.*

---

### Step 3: Run the Backend Server
1. While inside the `server/` directory, install Node dependencies:
   ```bash
   npm install
   ```
2. Start the server in hot-reload development mode:
   ```bash
   npm run dev
   ```
3. The server will start on `http://localhost:5000`. You should see:
   ```text
   ✅ PostgreSQL Database connected successfully
   🚀 CRM Backend Server running at http://localhost:5000
   ```

---

### Step 4: Run the Frontend Client
1. Open a new terminal window, navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install the React packages:
   ```bash
   npm install
   ```
3. Launch the Vite local dev server:
   ```bash
   npm run dev
   ```
4. Click or open `http://localhost:5173` in your browser. You are ready to manage your leads!

---

## 📡 REST API Documentation

All API endpoints are located in `server/server.js` and securely perform parameterized transactions:

| Method | Endpoint | Request Body | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/leads` | *None* | `search`, `source`, `status` | Retrieve all leads (supports dynamic filters & live search) |
| **POST** | `/api/leads` | `{ name, phone, source }` | *None* | Create a new lead (defaults status to 'Interested') |
| **PUT** | `/api/leads/:id` | `{ status }` | *None* | Update the status of a specific lead |
| **DELETE**| `/api/leads/:id` | *None* | *None* | Deletes a lead permanently from the records |

---

## 🌐 Production Deployment Steps

### 1. Database (Supabase PostgreSQL)
Supabase provides a hosted cloud PostgreSQL database with a free tier:
1. Sign up at [supabase.com](https://supabase.com/) and create a project.
2. Navigate to your project **Settings > Database**.
3. Under **Connection String**, select the **URI** tab. Copy either the **Direct connection** (Port 5432) or **Transaction Pooler** (Port 6543, recommended for serverless hosts, make sure to check the box for `pgbouncer` or append `?pgbouncer=true`).
4. Paste the connection string into your `.env` as `DATABASE_URL` (remember to replace the password placeholder with your actual project database password!).
5. Go to the **SQL Editor** in the Supabase Sidebar, click **New Query**, paste the table setup from [schema.sql](./schema.sql), and click **Run**.

### 2. Backend (Render)
Render makes deploying Node.js apps simple:
1. Push this project folder to your GitHub account.
2. Log into [render.com](https://render.com/) and click **New > Web Service**.
3. Link your GitHub repository.
4. Set the following details:
   *   **Root Directory:** `server`
   *   **Build Command:** `npm install`
   *   **Start Command:** `node server.js`
5. Click **Advanced > Add Environment Variables**:
   *   `PORT` = `10000` (or leave default)
   *   `DATABASE_URL` = *(Your Supabase database connection string copied earlier)*
   *   `NODE_ENV` = `production`
6. Deploy! Render will give you a public URL (e.g. `https://my-crm-backend.onrender.com`).

### 3. Frontend (Vercel or Netlify)
Vercel is the easiest place to host Vite React apps:
1. Log into [vercel.com](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository.
3. Configure the following:
   *   **Root Directory:** `client`
   *   **Framework Preset:** `Vite`
   *   **Build Command:** `npm run build`
   *   **Output Directory:** `dist`
4. Click **Deploy**. Vercel will host your client static files instantly!
