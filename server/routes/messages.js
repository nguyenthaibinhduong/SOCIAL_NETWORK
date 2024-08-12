var Express = require('express');
const router = Express.Router();
const Message = require('../controllers/messages');
router.get("/:id", Message.getByRoom);
router.post("/:id", Message.addMessages);
router.post("/r/new", Message.createRoom);
router.get("/r/list", Message.getListRoom);
router.get("/r/recent", Message.getRecentRoom);
// router.delete("/:id", Message.deleteMessage);


module.exports=router