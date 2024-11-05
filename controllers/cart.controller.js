const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

// @desc Creates new Cart Item
// note: this is add to cart function for user to add items into their shopping Cart.
const createCartItem = async (req, res, next) => {
  const { cartId, itemId, quantity, price } = req.body;
  try {
    if (!cartId || !itemId || !price || !quantity) {
      return next(createError(422, "Invalid input data"));
    }
    const cartItem = await db.cartItem.create({
      data: { cartId, itemId, quantity, price },
    });
    res.send({ message: "Cart item created", data: cartItem });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findCartItemsByCartId = async (req, res, next) => {
  const { cartId } = req.params;
  try {
    const cart = await db.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      return next(createError(422, "No such cart found"));
    }
    const cartItems = await db.cartItem.findMany({ where: { cartId } });
    if (!cartItems) {
      return next(createError(422, "No such cart item found"));
    }
    res.send({ message: "Cart items found", data: cartItems });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findCartItemById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(createError(422, "Id is required"));
    }
    const cartItem = await db.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      return next(createError(422, "No such cart item found"));
    }
    res.send({ message: "Cart item found", data: cartItem });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const deleteCartItemById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(createError(422, "Id is required"));
    }
    const cartItem = await db.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      return next(createError(422, "No such cart item found"));
    }
    const deletedItem = await db.cartItem.delete({ where: { id } });
    res.send({ message: "Deleted cart item", data: deletedItem });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const updateCartItemById = async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    if (!id) {
      return next(createError(422, "Id is required"));
    }
    const cartItem = await db.cartItem.findUnique({ where: { id } });
    if (!cartItem) {
      return next(createError(422, "No such cart item found"));
    }
    const updatedItem = await db.cartItem.update({
      where: { id },
      data: { quantity },
    });
    res.send({ message: "Cart item updated", data: updatedItem });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = {
  createCartItem,
  deleteCartItemById,
  updateCartItemById,
  findCartItemById,
  findCartItemsByCartId,
};
