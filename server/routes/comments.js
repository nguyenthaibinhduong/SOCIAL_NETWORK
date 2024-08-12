var Express = require('express');
const router = Express.Router();
const Comment = require('../controllers/comments');
router.get("/", Comment.getByPost);
router.get("/new", Comment.getNewByPost);
router.post("/", Comment.addComment);
router.delete("/:id", Comment.deleteComment);


module.exports=router