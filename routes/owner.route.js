const router = require("express").Router();
const { registerOwner } = require("../controllers/owner.controller");

router.post("/register", registerOwner);

module.exports = router;
