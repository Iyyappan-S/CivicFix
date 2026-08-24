const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Public endpoints to fetch categories & departments for forms
router.get('/categories', async (req, res, next) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories');
        res.json({ status: 'success', data: categories });
    } catch (err) {
        next(err);
    }
});

router.get('/departments', async (req, res, next) => {
    try {
        const [departments] = await db.execute('SELECT * FROM departments');
        res.json({ status: 'success', data: departments });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
