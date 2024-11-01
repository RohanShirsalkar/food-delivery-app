const router = require("express").Router();
const { registerUser, findById } = require("../controllers/user.controller");

// create find user by id
router.post("/register", registerUser);
router.get("/:id", findById);

module.exports = router;
