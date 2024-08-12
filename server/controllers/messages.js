const db = require('../connect');
const jwt = require('jsonwebtoken');
const moment = require('moment/moment');
require('dotenv').config();


exports.getByRoom = (req, res) => {
    const room_id = req.params.id;
    const token = req.cookies.access_token;
    
    if (!token) {
        return res.status(401).json('Not Logged in');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        if (err) return res.status(403).json('Invalid Token');

        // Kiểm tra xem người dùng có thuộc phòng đó hay không
        const checkRoomQuery = 'SELECT * FROM room_users WHERE room_id = ? AND user_id = ?';
        
        db.query(checkRoomQuery, [room_id, userData.id], (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json('User not in room');
            }

            // Nếu người dùng thuộc phòng, lấy tin nhắn của phòng đó
            const getMessageQuery = `
                SELECT m.*, u.id AS u_id, u.name, u.profile_image
                FROM messages AS m
                JOIN users AS u ON m.user_id = u.id
                WHERE m.room_id = ?
                ORDER BY m.created_at ASC
            `;
            
            db.query(getMessageQuery, [room_id], (err, messages) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(messages);
            });
        });
    });
};

exports.getListRoom = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q = `SELECT r.id as room_id,
                   m1.message as latest_message,
                   m1.created_at as latest_message_time,
                   u.id as user_id,
                   u.name as name,
                   u.profile_image as profile_image
            FROM rooms r
            JOIN room_users ru1 ON r.id = ru1.room_id
            JOIN room_users ru2 ON r.id = ru2.room_id AND ru2.user_id != ru1.user_id
            JOIN users u ON ru2.user_id = u.id
            LEFT JOIN (
                SELECT m.room_id, m.message, m.created_at
                FROM messages m
                INNER JOIN (
                    SELECT room_id, MAX(created_at) as latest_time
                    FROM messages
                    GROUP BY room_id
                ) lm ON m.room_id = lm.room_id AND m.created_at = lm.latest_time
            ) m1 ON r.id = m1.room_id
            WHERE ru1.user_id = ?
            ORDER BY m1.created_at DESC;`
        db.query(q, [data.id], (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    })
    
}
exports.getRecentRoom = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q = `SELECT r.id AS room_id FROM rooms r JOIN room_users ru1 ON r.id = ru1.room_id JOIN room_users ru2 ON r.id = ru2.room_id AND ru2.user_id != ru1.user_id JOIN users u ON ru2.user_id = u.id LEFT JOIN ( SELECT m.room_id, m.message, m.created_at FROM messages m INNER JOIN ( SELECT room_id, MAX(created_at) AS latest_time FROM messages GROUP BY room_id ) lm ON m.room_id = lm.room_id AND m.created_at = lm.latest_time ) m1 ON r.id = m1.room_id WHERE ru1.user_id = ? ORDER BY m1.created_at DESC LIMIT 1;`
        db.query(q, [data.id], (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    })
    
}
exports.addMessages = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const checkRoomQuery = 'SELECT * FROM room_users WHERE room_id = ? AND user_id = ?';
        
        db.query(checkRoomQuery, [req.body.room_id, data.id], (err, results) => {
            if (err) return res.status(500).json(err);

            if (results.length === 0) {
                return res.status(404).json('User not in room');
            }
            const q = 'INSERT INTO messages(room_id, user_id, message, image, created_at) VALUES (?)'
            const values = [
                req.body.room_id,
                req.body.user_id,
                req.body.message,
                req.body.image,
                moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            ];
            db.query(q, [values], (err, data) => { 
                if (err) return res.status(500).json(err);
                return res.status(200).json("Add message successfull");
            });
        });
    })
    
}
exports.createRoom = (req, res) => {
    const token = req.cookies.access_token;
    const { user_ids } = req.body;

    if (!token) { 
        return res.status(401).json('Not Logged in');
    }

    if (!user_ids || user_ids.length === 0) {
        return res.status(400).json('User IDs are required');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { 
        if (err) return res.status(403).json('Invalid Token');

        const checkRoomQuery = `
            SELECT room_id
            FROM room_users
            WHERE user_id IN (?)
            GROUP BY room_id
            HAVING COUNT(DISTINCT user_id) = ?
        `;
        
        db.query(checkRoomQuery, [user_ids, user_ids.length], (err, results) => {
            if (err) return res.status(500).json(err);
            
            if (results.length > 0) {
                // Return the existing room_id
                return res.status(200).json({ room_id: results[0].room_id });
            } else {
                // Create a new room
                const q1 = 'INSERT INTO rooms (created_at) VALUES (?)';
                const createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                
                db.query(q1, [createdAt], (err, result) => { 
                    if (err) return res.status(500).json(err);

                    const room_id = result.insertId;
                    const q2 = 'INSERT INTO room_users (room_id, user_id) VALUES ?';
                    const values = user_ids.map(user_id => [room_id, user_id]);

                    db.query(q2, [values], (err, result) => {
                        if (err) return res.status(500).json(err);
                        return res.status(200).json({ room_id });
                    });
                });
            }
        });
    });
}