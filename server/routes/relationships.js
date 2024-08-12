var Express = require('express');
const router = Express.Router();
const Relationships = require('../controllers/relationships');

router.get("/",Relationships.getRelationships);
router.post("/",Relationships.addRelationships);
router.delete("/",Relationships.deleteRelationships);

module.exports=router