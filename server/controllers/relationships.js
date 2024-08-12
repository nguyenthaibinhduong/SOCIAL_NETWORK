var db = require('../connect')
var jwt = require('jsonwebtoken');
require('dotenv').config();
exports.getRelationships = (req, res) => {
    const q = "SELECT follower_user_id FROM relationships WHERE followed_user_id = ?";
    db.query(q, [req.query.followed_user_id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map(relationship=>relationship.follower_user_id));
    });
}
exports.addRelationships = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,data) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "INSERT INTO relationships (`follower_user_id`,`followed_user_id`) VALUES (?)";
        const values = [
        data.id,
        req.query.user_id
        ];

        db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Following");
        });
    });
}

exports.deleteRelationships = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) { 
        return res.status(401).json('Not Logged in');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,data) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM `relationships` WHERE follower_user_id = ? AND followed_user_id = ? ";

        db.query(q, [data.id,req.query.user_id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Unfollowed");
        });
    });
}