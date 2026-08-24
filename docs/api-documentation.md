# CivicFix REST API Documentation

Base URL for all endpoints: `/api`

## Authentication

### `POST /auth/register`
**Body (JSON):** `name`, `email`, `password`, `phone` (optional), `address` (optional)
**Returns:** `201 Created` - `{ "status": "success", "message": "..." }`

### `POST /auth/login`
**Body (JSON):** `email`, `password`
**Returns:** `200 OK` - Object containing `token` and `user` object.

### `GET /auth/me`
**Headers:** `Authorization: Bearer <token>`
**Returns:** `200 OK` - Details of the authorized user.

## Complaints

### `POST /complaints`
**Headers:** `Authorization: Bearer <token>` (Citizen or Admin)
**Body (JSON):** `category_id`, `title`, `description`, `latitude`, `longitude`, `address`
**Returns:** `201 Created` - Insert Id and unique complaint code (e.g. `CF-2026-...`).

### `GET /complaints`
**Headers:** `Authorization: Bearer <token>`
**Query (Optional):** `?status=SUBMITTED`
**Returns:** Array of complaints. (Backend auto-filters by RBAC: Citizen sees own, Officer sees assigned, Admin sees all).

### `GET /complaints/:id`
**Headers:** `Authorization: Bearer <token>`
**Returns:** Full complaint details, including mapped category names, history array, and image array.

### `PUT /complaints/:id/status`
**Headers:** `Authorization: Bearer <token>` (Admin or Officer)
**Body (JSON):** `status` (e.g. "IN_PROGRESS"), `note`
**Returns:** `200 OK` - Status Updated.

### `PUT /complaints/:id/assign`
**Headers:** `Authorization: Bearer <token>` (Admin only)
**Body (JSON):** `department_id`, `officer_id`, `priority`
**Returns:** `200 OK` - Assigned successfully.

### `POST /complaints/:id/images`
**Headers:** `Authorization: Bearer <token>`
**Body (FormData):** file attachment bound to `images` key.
**Returns:** `200 OK` - Images uploaded.

## Public / Utilities

### `GET /public/categories`
**Returns:** Arrays of valid category IDs for dropdowns.

### `GET /public/departments`
**Returns:** Arrays of valid departments.

### `GET /analytics/overview`
**Headers:** `Authorization: Bearer <token>` (Admin only)
**Returns:** JSON dictionary with key metrics (`totalComplaints`, `activeOfficers`, etc.).
