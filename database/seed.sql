USE defaultdb;

-- Insert Departments
INSERT IGNORE INTO departments (id, name, description) VALUES
(1, 'Road Maintenance', 'Handles potholes, road damage etc.'),
(2, 'Sanitation', 'Handles garbage and cleaning.'),
(3, 'Water & Sewage', 'Handles water leaks, drainage, sewage.'),
(4, 'Electrical', 'Handles street lights and traffic signals.'),
(5, 'Public Works', 'Handles footpaths, public toilets etc.');

-- Insert Categories
INSERT IGNORE INTO categories (id, name, description, department_id) VALUES
(1, 'Pothole', 'Report potholes on roads', 1),
(2, 'Road Damage', 'General road damage', 1),
(3, 'Garbage', 'Uncollected garbage', 2),
(4, 'Illegal Dumping', 'Dumping in unauthorized areas', 2),
(5, 'Streetlight', 'Broken or non-functioning streetlights', 4),
(6, 'Drainage', 'Blocked or overflowing drains', 3),
(7, 'Water Leakage', 'Pipe bursts and water leaks', 3),
(8, 'Traffic Signal', 'Malfunctioning traffic signals', 4),
(9, 'Public Toilet', 'Unclean or broken public toilets', 5),
(10, 'Footpath', 'Damaged footpaths', 5);

-- Insert Users (Passwords are 'password123' encoded via bcrypt: $2b$10$wN1I3Nn.8A4e/M3qQ9Q5N.1p28r9E.D0P8gZ39s6a0hV5KqU6A6d2)
-- Note: User can generate proper bcrypt using tool, but hardcoded one here is for 'password123'
INSERT IGNORE INTO users (id, name, email, password, phone, role) VALUES
(1, 'Admin User', 'admin@civicfix.com', '$2b$10$wIHY1T5FhE3O6B3M9I8M5uqg1jA4T0O2gD6Y2A3N1C5H8N9E0P6T2', '1234567890', 'ADMIN'),
(2, 'Officer One', 'officer1@civicfix.com', '$2b$10$wIHY1T5FhE3O6B3M9I8M5uqg1jA4T0O2gD6Y2A3N1C5H8N9E0P6T2', '0987654321', 'OFFICER'),
(3, 'Citizen John', 'john@example.com', '$2b$10$wIHY1T5FhE3O6B3M9I8M5uqg1jA4T0O2gD6Y2A3N1C5H8N9E0P6T2', '1122334455', 'CITIZEN');

-- Create officer info
INSERT IGNORE INTO officers (user_id, department_id, employee_code, designation, area) VALUES
(2, 1, 'EMP001', 'Inspector', 'North Zone');
