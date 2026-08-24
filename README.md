# CivicFix - Smart Civic Issue Reporting & Resolution Platform

## Problem Statement
Citizens frequently struggle to report daily infrastructural and civic problems like broken streetlights, potholes, and water leakage. The processes are slow, lack tracking, and feel disconnected from municipal operations.

## Solution
**CivicFix** is a modern, end-to-end full-stack platform built to bridge the gap between citizens and authorities. It features three primary modules:
1. **Citizen Portal:** Easy issue reporting with map geolocation and direct photo uploads. Status tracking prevents frustration.
2. **Admin/Municipal Dashboard:** High-level metrics, role management, and issue routing assignments.
3. **Field Officer Dashboard:** Dedicated view for officers to manage their exact assignments, update notes, and close out operations.

## 🚀 Key Features
- **Role-Based Workflows** (CITIZEN, ADMIN, OFFICER)
- **Geospatial Tracking** via Leaflet/OpenStreetMap.
- **Image Evidence** uploads using Multer.
- **Analytics Overview** for fast Admin intelligence.
- **Complete Audit Trail** of every complaint status adjustment.
- **Clean/Modern UI** using purely Custom CSS.

## 💻 Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Fetch API
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Security:** JWT (JSON Web Tokens), Bcrypt Hashing, Role-Middleware

## 🗄️ Database Structure Snapshot
- `users`: Core Identity (Passwords securely hashed)
- `departments` & `categories`: Taxonomy for issues
- `complaints`: Geolocation, metadata, references to users and categories.
- `complaint_status_history`: Auditing log of status updates
- `complaint_images`: 1-to-many link of images for complaints.

## 🧑‍💻 How To Run
Read **[docs/setup.md](docs/setup.md)** for exhaustive step-by-step instructions.

### Quick Start:
1. Load `schema.sql` and `seed.sql` into MySQL.
2. `cd backend && npm install`
3. Edit `backend/.env` with your SQL database credentials.
4. `npm run dev` in the backend folder.
5. Serve the `frontend/` folder using any static server (e.g. `npx serve frontend`).

### Demo Accounts
*(Password for all defaults to `password123`)*
* `admin@civicfix.com` (Admin Access)
* `officer1@civicfix.com` (Officer Access)
* `john@example.com` (Citizen Access)

## 📡 API Overview (Brief)
- `POST /api/auth/login`: Authenticate and receive token
- `POST /api/complaints`: File a new civic request
- `PUT /api/complaints/:id/assign`: (Admin) Assign issue to officer
- `PUT /api/complaints/:id/status`: (Officer/Admin) Update issue lifecycle state
- `POST /api/complaints/:id/images`: Attach form-data images

## 🏗️ Deployment Instructions
1. **Database:** Deploy MySQL on a cloud service like AWS RDS, PlanetScale, or a DigitalOcean Droplet.
2. **Backend:** Host the `backend` code on Render, Railway, or Heroku. Make sure to bind Environment Variables (`DB_HOST`, `DB_USER`, `JWT_SECRET`) properly on the dashboard. Update `CLIENT_URL` to allow CORS from your deployed frontend.
3. **Frontend:** Modify `API_URL` under `js/api.js` to point to the live backend. Deploy the frontend on Vercel, Netlify, or GitHub Pages.

---
*Built as a Full-Stack Final Year Project & Professional Portfolio Showcase.*
"# CivicWise-Fix" 
