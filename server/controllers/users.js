var db = require('../connect')
var jwt = require('jsonwebtoken');
require('dotenv').config();
exports.getUser = (req, res) => {
    const user_id = req.params.id;
    const q = `SELECT * FROM users WHERE id = ?`;

    db.query(q, [user_id], (err, data) => { 
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.status(200).json(info);
     });
}
exports.getFriend = (req, res) => {
   const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q = `SELECT u.id, u.name , u.profile_image FROM users as u join relationships as r on (r.followed_user_id=u.id) WHERE follower_user_id=? LIMIT 10`;

        db.query(q, [data.id,data.id], (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    })
    
}
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
                SELECT u.id, u.name, u.profile_image FROM room_users AS r JOIN users AS u ON r.user_id = u.id WHERE r.room_id = ? AND r.user_id !=? 
            `;
            
            db.query(getMessageQuery, [room_id,userData.id], (err, messages) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json(messages);
            });
        });
    });
}
exports.updateUser = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json('Invalid Token');
        const q = "UPDATE users SET name = ?, cover_image = ?,profile_image = ?,city = ?,website = ? WHERE id = ?";
        const values = [
            req.body.name,
            req.body.cover_image,
            req.body.profile_image,
            req.body.city,
            req.body.website,
            data.id,
        ];
        db.query(q,values, (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been updated !");
        });
    })
    
}
