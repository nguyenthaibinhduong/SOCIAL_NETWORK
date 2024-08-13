const moment = require('moment/moment');
var db = require('../connect')
var jwt = require('jsonwebtoken');
require('dotenv').config();
exports.getPost = (req, res) => {
    const user_id = req.query.user_id;
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json("Not logged");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => { 
        if (err) return res.status(403).json('Invalid Token');
        const q =
        (user_id != undefined) ?
        `SELECT p.*, u.id AS user_id, name, profile_image FROM posts AS p JOIN users AS u ON (u.id = p.user_id) WHERE p.user_id =? ORDER BY p.created_at DESC`:
        `SELECT p.*, u.id AS user_id, name, profile_image FROM posts AS p JOIN users AS u ON (u.id = p.user_id) LEFT JOIN relationships AS r ON (p.user_id = r.followed_user_id) WHERE r.follower_user_id= ? OR p.user_id =? GROUP BY p.id ORDER BY p.created_at DESC`;
        values = user_id !== undefined ?   [user_id]:[data.id, data.id];
        db.query(q, values, (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    })
    
}
exports.addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json('Invalid Token');
        const q = "INSERT INTO posts(description,img,user_id,created_at) VALUES (?)";
        const values = [
            req.body.description,
            req.body.img,
            data.id,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        ];
        db.query(q, [values], (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created !");
        });
    })
    
}
exports.deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json('Invalid Token');
        const q = `DELETE FROM posts WHERE id =? and user_id =?`;
        const values = [
            req.params.id,
            data.id,
        ];
        db.query(q, values, (err, data) => { 
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been deleted !");
        });
    })
    
}
