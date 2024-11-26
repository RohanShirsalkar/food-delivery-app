const router = require("express").Router();
const {
  createCartItem,
  deleteCartItemById,
  updateCartItemById,
  findCartItemById,
  findCartItemsByCartId,
  findCartByUserId,
  deleteAllCartItemsByCartId,
} = require("../controllers/cart.controller");

router.post("/cartItem", createCartItem);
router.get("/:cartId", findCartItemsByCartId);
router.get("/cartItem/:id", findCartItemById);
router.get("/user/:userId", findCartByUserId);
router.put("/cartItem/:id", updateCartItemById);
router.delete("/cartItem/:id", deleteCartItemById);
router.delete("/clearCart/:id", deleteAllCartItemsByCartId);

module.exports = router;
