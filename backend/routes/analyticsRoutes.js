const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/overview', authMiddleware, roleMiddleware('ADMIN'), async (req, res, next) => {
    try {
        const [[users]] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role="CITIZEN"');
        const [[complaints]] = await db.execute('SELECT COUNT(*) as total FROM complaints');
        const [[pending]] = await db.execute('SELECT COUNT(*) as total FROM complaints WHERE status NOT IN ("RESOLVED", "REJECTED", "CLOSED")');
        const [[resolved]] = await db.execute('SELECT COUNT(*) as total FROM complaints WHERE status="RESOLVED"');
        const [[officers]] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role="OFFICER"');

        res.json({
            status: 'success',
            data: {
                totalUsers: users.total,
                totalComplaints: complaints.total,
                pendingComplaints: pending.total,
                resolvedComplaints: resolved.total,
                activeOfficers: officers.total
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/categories', authMiddleware, roleMiddleware('ADMIN'), async (req, res, next) => {
    try {
        const [stats] = await db.execute(`
            SELECT cat.name, COUNT(c.id) as count 
            FROM categories cat
            LEFT JOIN complaints c ON cat.id = c.category_id
            GROUP BY cat.id
        `);
        res.json({ status: 'success', data: stats });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
