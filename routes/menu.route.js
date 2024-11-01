const router = require("express").Router();
const {
  createMenuItem,
  findMenuItemsByRestaurantId,
} = require("../controllers/menu.controller");

// create find menu items route
router.post("/menuItem", createMenuItem);
router.get("/:restaurantId", findMenuItemsByRestaurantId);

module.exports = router;
