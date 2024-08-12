var Express = require('express');
const router = Express.Router();
const User = require('../controllers/users');
router.get("/find/:id", User.getUser);
router.get("/friends", User.getFriend);
router.get("/rooms/:id", User.getByRoom);
router.put("/",User.updateUser);

module.exports=router