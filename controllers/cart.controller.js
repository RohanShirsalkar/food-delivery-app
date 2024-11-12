const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");
const { calculateCartTotal } = require("../utils/app.utils");

const db = new PrismaClient();

// @desc (Add To Cart) Creates new Cart Item and updates total price
// @rule Do not add item to cart if item from some other restaurant already exists.
// @rule Only add item if it belongs to the same restaurant.
const createCartItem = async (req, res, next) => {
  const { cartId, menuItemId, restaurantId, quantity } = req.body;
  try {
    // find cart items with cart id
    // if cart item already exists then increment quantity else create new one.
    // if cart item belongs to same restaurant then add item to cart else throw error.
    // if cart is empty add item to cart.
    if (!cartId || !menuItemId || !restaurantId || !quantity) {
      return next(createError(422, "Invalid input data"));
    }
    const cart = await db.cart.findUnique({
      where: { id: cartId },
      include: { cartItem: true },
    });
    const menuItem = await db.menuItem.findUnique({
      where: { id: menuItemId },
    });
    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!cart) {
      return next(createError(422, "Cart not found"));
    }
    if (!menuItem) {
      return next(createError(422, "Menu item not found"));
    }
    if (!restaurant) {
      return next(createError(422, "Restaurant not found"));
    }
    // if(cart.cartItem.length > 0){
    // }
    const cartItem = await db.cartItem.create({
      data: {
        cartId,
        menuItemId,
        restaurantId,
        quantity,
        price: menuItem.price,
      },
    });
    const cartItems = await db.cartItem.findMany({ where: { cartId } });
    const updatedCart = await db.cart.update({
      where: { id: cartId },
      data: {
        total: calculateCartTotal(cartItems),
      },
      include: { cartItem: true },
    });
    res.send({ message: "Cart item created", data: updatedCart });
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

const findCartByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return next(createError(501, "User ID not provided"));
    }
    const cart = await db.cart.findUnique({
      where: { userId },
      include: { cartItem: true },
    });
    if (!cart) {
      return next(createError(422, "No such cart found"));
    }
    res.send({ message: "Found cart", data: cart });
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
    const cartItems = await db.cartItem.findMany({
      where: { cartId: deletedItem.cartId },
    });
    const updatedCart = await db.cart.update({
      where: { id: deletedItem.cartId },
      data: { total: calculateCartTotal(cartItems) },
      include: { cartItem: true },
    });
    res.send({ message: "Deleted cart item", data: updatedCart });
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
    const cartItems = await db.cartItem.findMany({
      where: { cartId: updatedItem?.cartId },
    });
    const updatedCart = await db.cart.update({
      where: { id: updatedItem?.cartId },
      data: { total: calculateCartTotal(cartItems) },
      include: { cartItem: true },
    });
    res.send({ message: "Cart item updated", data: updatedCart });
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
  findCartByUserId,
};
