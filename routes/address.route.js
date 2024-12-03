const router = require("express").Router();
const { create, findByUserId } = require("../controllers/address.controller");

// create find user by id
router.post("/", create);
router.get("/user/:userId", findByUserId);

module.exports = router;
