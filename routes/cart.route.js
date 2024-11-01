const router = require("express").Router();
const {
  createCartItem,
  deleteCartItemById,
  updateCartItemById,
  findCartItemById,
  findCartItemsByCartId,
} = require("../controllers/cart.controller");

router.post("/cartItem", createCartItem);
router.get("/:cartId", findCartItemsByCartId);
router.get("/cartItem/:id", findCartItemById);
router.put("/cartItem", updateCartItemById);
router.delete("/cartItem", deleteCartItemById);

module.exports = router;
