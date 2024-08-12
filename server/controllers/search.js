var db = require('../connect')
var jwt = require('jsonwebtoken');
require('dotenv').config();
exports.searchPosts = (req,res) => {
    
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q = "SELECT p.*, u.id AS user_id, name, profile_image FROM posts AS p JOIN users AS u ON (u.id = p.user_id) WHERE p.description like ? ORDER BY p.created_at DESC";
        db.query(q, [`%${req.query.key}%`],(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        }); 
    })
}
exports.searchUsers = (req,res) => {
    
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q = "SELECT id, name, profile_image,cover_image, city, website FROM users WHERE name like ? and id != ?";
        db.query(q, [`%${req.query.key}%`,data.id],(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        }); 
    })
}