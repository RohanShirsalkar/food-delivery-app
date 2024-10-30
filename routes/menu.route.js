const router = require("express").Router();
const { createMenuItem } = require("../controllers/menu.controller");

// create find menu items route
router.post("/", createMenuItem);

module.exports = router;
