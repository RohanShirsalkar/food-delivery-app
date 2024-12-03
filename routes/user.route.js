const router = require("express").Router();
const {
  registerUser,
  findById,
  loginUser,
} = require("../controllers/user.controller");

// create find user by id
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", findById);

module.exports = router;
