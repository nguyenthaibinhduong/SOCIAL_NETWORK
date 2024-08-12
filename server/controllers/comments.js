const db = require('../connect');
const jwt = require('jsonwebtoken');
const moment = require('moment/moment');
require('dotenv').config();
exports.getByPost = (req, res) => { 
    const q = `SELECT c.*, u.id AS user_id, name, profile_image FROM comments AS c JOIN users AS u ON (u.id = c.user_id)
                where c.post_id = ? ORDER BY c.created_at DESC`;
    db.query(q, [req.query.post_id], (err, data) => { 
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}
exports.getNewByPost = (req, res) => { 
    const q = `SELECT c.*, u.id AS user_id, name, profile_image FROM comments AS c JOIN users AS u ON (u.id = c.user_id)
                where c.post_id = ? ORDER BY c.created_at DESC LIMIT 2`;
    db.query(q, [req.query.post_id], (err, data) => { 
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

exports.addComment = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json('Invalid Token');
        const q = "INSERT INTO comments(description,user_id,post_id,created_at) VALUES (?)";
        const values = [
            req.body.description,
            data.id,
            req.body.post_id,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        ];
        db.query(q, [values], (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been created !");
        });
    })
    
}
exports.deleteComment = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json('Invalid Token');
        const q = `DELETE FROM comments WHERE id =? and user_id =?`;
        const values = [
            req.params.id,
            data.id,
        ];
        db.query(q, values, (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comments has been deleted !");
        });
    })
    
}