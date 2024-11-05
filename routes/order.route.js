const router = require("express").Router();
const {
  createOrder,
  getOrdersByUserId,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUserId);

module.exports = router;
