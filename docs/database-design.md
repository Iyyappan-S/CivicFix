# CivicFix Database Design

## Overview
CivicFix uses a normalized MySQL relational database designed to minimize data redundancy and enforce referential integrity.

## Tables & Relationships

### `users`
Core table for all authentication.
- **Fields:** `id`, `name`, `email` (UNIQUE), `password`, `role` (CITIZEN, OFFICER, ADMIN)
- **Use Case:** Holds login identities and standard contact details.

### `departments`
Groups operations (e.g. Sanitation, Roads, Electricity).
- **Fields:** `id`, `name` (UNIQUE), `description`.

### `officers`
Extensions of the `users` table for Officers. 
- **Fields:** `id`, `user_id` (FK -> users), `department_id` (FK -> departments), `employee_code`, `area`.
- **Relationship:** 1:1 with `users` where role is OFFICER. 

### `categories`
Hierarchy under departments (e.g. "Pothole" belongs to "Roads").
- **Fields:** `id`, `name`, `department_id` (FK -> departments).

### `complaints`
Central transaction table holding issue reports.
- **Fields:** `id`, `complaint_code` (e.g. CF-1234), `citizen_id` (FK), `category_id` (FK), `department_id` (FK), `officer_id` (FK), `title`, `description`, `status` (SUBMITTED, ASSIGNED, RESOLVED, etc.), `latitude`, `longitude`, timestamps.

### `complaint_images`
Holds file references to uploaded photos for evidence.
- **Fields:** `id`, `complaint_id` (FK), `image_path`, `image_type` (ISSUE vs RESOLUTION).

### `complaint_status_history`
Acts as an immutable ledger / audit log for every change made to a complaint.
- **Fields:** `id`, `complaint_id` (FK), `old_status`, `new_status`, `changed_by` (FK -> users), `note`.

### `feedback` (Optional Module)
To collect post-resolution satisfaction metrics from citizens.
- **Fields:** `id`, `complaint_id`, `citizen_id`, `rating` (1-5), `comment`.

## Indexing Strategy
To ensure speed under high workload, indexes are added to:
- `users(email)`
- `complaints(complaint_code)`
- `complaints(status)`
- `complaints(latitude, longitude)` for future geographic radius searching.
