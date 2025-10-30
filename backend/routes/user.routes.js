const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware untuk verifikasi token dan role owner
const verifyOwner = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        if (decoded.role !== 'owner') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        req.user = decoded;
        next();
    });
};

// Get all users (owner only)
router.get('/', verifyOwner, (req, res) => {
    db.query('SELECT id, username, name, role, created_at FROM users WHERE role = "staff"', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, data: results });
    });
});

// Update user (owner only)
router.put('/:id', verifyOwner, async (req, res) => {
    const { name, password } = req.body;
    const userId = req.params.id;

    try {
        let query = 'UPDATE users SET name = ?';
        let params = [name];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ? AND role = "staff"';
        params.push(userId);

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
            }

            res.json({ 
                success: true, 
                message: 'User berhasil diupdate',
                data: { id: userId, name }
            });
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete user (owner only)
router.delete('/:id', verifyOwner, (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ? AND role = "staff"', [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        res.json({ 
            success: true, 
            message: 'User berhasil dihapus' 
        });
    });
});

module.exports = router;