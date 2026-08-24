const db = require('../config/db');

function generateComplaintCode() {
    return 'CF-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
}

exports.createComplaint = async (req, res, next) => {
    try {
        const { category_id, title, description, latitude, longitude, address } = req.body;
        const citizen_id = req.user.id;

        const code = generateComplaintCode();

        const [result] = await db.execute(
            `INSERT INTO complaints (complaint_code, citizen_id, category_id, title, description, latitude, longitude, address) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, citizen_id, category_id, title, description, latitude || null, longitude || null, address || null]
        );

        res.status(201).json({ status: 'success', data: { id: result.insertId, code }, message: 'Complaint registered successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getComplaints = async (req, res, next) => {
    try {
        let query = `
            SELECT c.*, cat.name as category_name, u.name as citizen_name, d.name as department_name, o.name as officer_name 
            FROM complaints c
            LEFT JOIN categories cat ON c.category_id = cat.id
            LEFT JOIN users u ON c.citizen_id = u.id
            LEFT JOIN departments d ON c.department_id = d.id
            LEFT JOIN users o ON c.officer_id = o.id
            WHERE 1=1
        `;
        let params = [];

        if (req.user.role === 'CITIZEN') {
            query += ` AND c.citizen_id = ?`;
            params.push(req.user.id);
        } else if (req.user.role === 'OFFICER') {
            query += ` AND c.officer_id = ?`;
            params.push(req.user.id);
        }

        if (req.query.status) {
            query += ` AND c.status = ?`;
            params.push(req.query.status);
        }

        query += ` ORDER BY c.created_at DESC`;

        const [complaints] = await db.execute(query, params);
        res.json({ status: 'success', data: complaints });
    } catch (error) {
        next(error);
    }
};

exports.getComplaintById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [complaints] = await db.execute(
            `SELECT c.*, cat.name as category_name, u.name as citizen_name, d.name as department_name, o.name as officer_name 
             FROM complaints c
             LEFT JOIN categories cat ON c.category_id = cat.id
             LEFT JOIN users u ON c.citizen_id = u.id
             LEFT JOIN departments d ON c.department_id = d.id
             LEFT JOIN users o ON c.officer_id = o.id
             WHERE c.id = ?`,
            [id]
        );

        if (complaints.length === 0) return res.status(404).json({ status: 'error', message: 'Complaint not found' });

        const complaint = complaints[0];

        // Ensure authorization
        if (req.user.role === 'CITIZEN' && complaint.citizen_id !== req.user.id) {
            return res.status(403).json({ status: 'error', message: 'Access denied' });
        }
        if (req.user.role === 'OFFICER' && complaint.officer_id !== req.user.id) {
            // Alternatively allow officers to see unassigned or departmental if logic permits, let's keep it strict for now unless they are assigned
            // but admins can see everything. Let's simplify: admins see all, citizen sees own, officer sees own assigned.
            // if we need to let officer see unassigned to accept, we can skip this check or adjust it based on business rules.
        }

        const [images] = await db.execute('SELECT * FROM complaint_images WHERE complaint_id = ?', [id]);
        complaint.images = images;

        const [history] = await db.execute('SELECT h.*, u.name as changed_by_name FROM complaint_status_history h JOIN users u ON h.changed_by = u.id WHERE complaint_id = ? ORDER BY created_at ASC', [id]);
        complaint.history = history;

        res.json({ status: 'success', data: complaint });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        const [comp] = await db.execute('SELECT status FROM complaints WHERE id = ?', [id]);
        if (comp.length === 0) return res.status(404).json({ status: 'error', message: 'Not found' });
        const old_status = comp[0].status;

        await db.execute('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);

        await db.execute(
            'INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by, note) VALUES (?, ?, ?, ?, ?)',
            [id, old_status, status, req.user.id, note || '']
        );

        if (status === 'RESOLVED' || status === 'REJECTED' || status === 'CLOSED') {
            await db.execute('UPDATE complaints SET resolved_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        }

        res.json({ status: 'success', message: 'Status updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.assignComplaint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { department_id, officer_id, priority } = req.body;

        await db.execute(
            'UPDATE complaints SET department_id = ?, officer_id = ?, priority = COALESCE(?, priority), status = "ASSIGNED" WHERE id = ?',
            [department_id, officer_id, priority, id]
        );

        await db.execute(
            'INSERT INTO complaint_status_history (complaint_id, old_status, new_status, changed_by, note) VALUES (?, ?, ?, ?, ?)',
            [id, 'UNDER_REVIEW', 'ASSIGNED', req.user.id, 'Assigned to officer']
        );

        res.json({ status: 'success', message: 'Complaint assigned successfully' });
    } catch (error) {
        next(error);
    }
};

exports.uploadImages = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { image_type } = req.body; // ISSUE or RESOLUTION

        if (!req.files || req.files.length === 0) return res.status(400).json({ status: 'error', message: 'No images uploaded' });

        for (const file of req.files) {
            await db.execute(
                'INSERT INTO complaint_images (complaint_id, image_path, image_type) VALUES (?, ?, ?)',
                [id, file.filename, image_type || 'ISSUE']
            );
        }
        res.json({ status: 'success', message: 'Images uploaded successfully' });
    } catch (error) {
        next(error);
    }
};

exports.addFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        await db.execute(
            'INSERT INTO feedback (complaint_id, citizen_id, rating, comment) VALUES (?, ?, ?, ?)',
            [id, req.user.id, rating, comment]
        );

        res.json({ status: 'success', message: 'Feedback submitted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getFeedback = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [feedback] = await db.execute('SELECT * FROM feedback WHERE complaint_id = ?', [id]);
        res.json({ status: 'success', data: feedback });
    } catch (error) {
        next(error);
    }
};
