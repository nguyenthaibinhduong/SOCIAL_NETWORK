var Express = require('express');
const router = Express.Router();
const Like = require('../controllers/likes');
router.get("/", Like.getLike);
router.get("/users",Like.getUserLiked);
router.post("/",Like.addLike);
router.delete("/",Like.deleteLike);

module.exports=router