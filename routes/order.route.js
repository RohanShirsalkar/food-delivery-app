const router = require("express").Router();
const {
  createOrder,
  getOrdersByUserId,
  findOrderById,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/user/:userId", getOrdersByUserId);
router.get("/:orderId", findOrderById);

module.exports = router;
