# CivicFix Architecture

## Frontend Architecture
- **Tech Stack:** HTML5, CSS3 (Vanilla), JavaScript, Leaflet.js
- **Structure:**
  - `citizen/`: Dashboard and reporting tools for citizens.
  - `officer/`: Dashboard and tools for assigned officers to update complaints.
  - `admin/`: Complete management view, analytics, assign complaints.
  - `js/api.js`: A core centralized API calling service managing JWT tokens in `localStorage`.
- **Styling:** Custom Vanilla CSS utilizing CSS variables for theme consistency across all dashboards (`style.css`).

## Backend Architecture
- **Tech Stack:** Node.js, Express.js, MySQL (mysql2 promise)
- **Core Components:**
  - **Controllers:** Business logic separated by entity (`auth`, `complaints`, `analytics`).
  - **Routes:** API routing definitions.
  - **Middleware:** `authMiddleware` for validating JWT and checking Role Based Access Control (RBAC).
  - **Config:** DB Setup using Connection Pools to minimize latency.
- **RESTful Endpoints:** Organized conceptually (e.g. `/api/auth`, `/api/complaints`, `/api/analytics`).

## Workflow
1. User authenticates via `/api/auth/login`. Token stored on Frontend.
2. Citizen posts to `/api/complaints` and optional `/api/complaints/:id/images`.
3. Admin queries `/api/complaints`, sees all submitted requests.
4. Admin assigns the complaint sending PUT to `/api/complaints/:id/assign`.
5. Officer queries assigned requests, updates status sending PUT to `/api/complaints/:id/status`.
