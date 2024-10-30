const router = require("express").Router();
const { registerUser } = require("../controllers/user.controller");

// create find user by id
router.post("/register", registerUser);

module.exports = router;
