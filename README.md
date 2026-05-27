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

## 📂 Project Structure
This application uses a unified, single-folder project structure. All front-end assets, back-end APIs, and packages reside together in the root directory. This avoids maintaining separate folders or installing separate `node_modules` folders, making it incredibly easy to manage and run:

```text
Lead Management System(CRM)/
├── src/                        # React Frontend Source Files
│   ├── components/             # Reusable dashboard UI parts
│   │   ├── Dashboard.jsx       # Dynamic metrics cards
│   │   ├── LeadForm.jsx        # Validation inputs for lead entries
│   │   └── LeadList.jsx        # Desktop tables & mobile grid layouts
│   ├── App.css                 
│   ├── App.jsx                 # Dynamic query search and toast coordinates
│   ├── index.css               # Main global stylesheet & design system
│   └── main.jsx                # React application entry-point
├── db.js                       # PostgreSQL client pool & SSL auto-detector
├── server.js                   # Unified Express backend & API endpoints
├── index.html                  # Core HTML file template
├── vite.config.js              # Vite server & API proxy rules configuration
├── package.json                # Single unified package manager
├── .env                        # Local secret database credentials
├── .env.example                # Cloud database credentials template
├── schema.sql                  # PostgreSQL table structure migration code
└── README.md                   # Core documentation (This file!)
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

### Step 2: Configure Environment Variables
1. In the root directory, create a `.env` file (you can copy [.env.example](./.env.example)):
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lead_db
   ```
   *Note: Adjust the username/password in the connection string to match your local database credentials or your cloud Supabase database URL.*

---

### Step 3: Install Unified Dependencies
1. Open your terminal in the root project folder and run:
   ```bash
   npm install
   ```
   *This single command installs all frontend and backend libraries (Express, React, Vite, PG pool, Nodemon, and Concurrently).*

---

### Step 4: Run the Application (Single Command!)
1. Start both the React frontend and the Express backend simultaneously with one command:
   ```bash
   npm run dev
   ```
2. The terminal will spin up:
   *   **Express Backend Server** at `http://localhost:5000`
   *   **Vite React Dev Server** at `http://localhost:5173`
3. Open `http://localhost:5173` in your browser. You are fully ready to manage your leads!


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
