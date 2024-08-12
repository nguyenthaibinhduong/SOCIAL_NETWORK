var Express = require('express');
const router = Express.Router();
const Post = require('../controllers/posts');
router.get("/", Post.getPost);
router.post("/", Post.addPost);
router.delete("/:id", Post.deletePost);
module.exports=router