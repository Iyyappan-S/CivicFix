# Setup & Installation Guide

## Pre-requisites
- **Node.js**: v16+
- **MySQL Server**: v8+ running locally or in cloud.

## 1. Database Setup
1. Open your MySQL client (e.g. MySQL Workbench, phpMyAdmin, or CLI).
2. Create the database and tables utilizing the provided schema:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Load the default configuration and seed data:
   ```bash
   mysql -u root -p civicfix < database/seed.sql
   ```

## 2. Backend Setup
1. Open terminal in the `backend/` folder:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and configure your Database variables (specifically `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
3. Start the server (Dev Mode):
   ```bash
   npm run dev
   ```

## 3. Frontend Setup
Because the frontend is built using standard Vanilla HTML/JS, you can serve it via Live Server in VSCode or a simple Python/HTTP server. Do not open raw `.html` files in the browser; `cors` behavior with `file://` might block API requests.

Using a simple Python server:
```bash
cd frontend
python -m http.server 5500
```
Then navigate to `http://localhost:5500` in your web browser.

## 4. Test Accounts Provided
(Password for all: `password123`)
- **Admin**: `admin@civicfix.com`
- **Officer**: `officer1@civicfix.com`
- **Citizen**: `john@example.com`
