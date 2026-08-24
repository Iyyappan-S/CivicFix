const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roleMiddleware('ADMIN'), async (req, res, next) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users');
        res.json({ status: 'success', data: users });
    } catch (err) {
        next(err);
    }
});

router.get('/officers', authMiddleware, roleMiddleware('ADMIN'), async (req, res, next) => {
    try {
        const [officers] = await db.execute('SELECT id, name, email FROM users WHERE role="OFFICER"');
        res.json({ status: 'success', data: officers });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
