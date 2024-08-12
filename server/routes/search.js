var Express = require('express');
const router = Express.Router();
const Search = require('../controllers/search');
router.get("/posts", Search.searchPosts);
router.get("/users", Search.searchUsers);


module.exports=router