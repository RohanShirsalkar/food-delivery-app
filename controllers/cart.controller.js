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
    let firstCartItem = cart?.cartItem[0];
    if (!firstCartItem) {
      // if there is no existing items then create a new one and update total price
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
    } else if (firstCartItem?.restaurantId !== restaurantId) {
      return res.send({
        message: "This item belongs to other restaurant",
        cartItemExists: true,
      });
    } else {
      // if an item already exists in the same Cart
      cart.cartItem.forEach(async (item, index) => {
        if (item.menuItemId === menuItemId) {
          // if the item is same as the new one then update quantity
          const updatedCartItem = await db.cartItem.update({
            where: { id: item.id },
            data: { quantity: item.quantity + quantity },
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
        } else if (index === cart.cartItem.length - 1) {
          // loop through entire array
          // if the item is not same as new one then create a new cartItem and update total price
          const cartItem = await db.cartItem.create({
            data: {
              cartId,
              menuItemId,
              restaurantId,
              quantity,
              price: menuItem.price,
            },
          });
          // const cart = await db.cart.findFirst({
          //   where: { id: cartId },
          //   include: { cartItem: true },
          // });
          const cartItems = await db.cartItem.findMany({ where: { cartId } });
          const updatedCart = await db.cart.update({
            where: { id: cartId },
            data: {
              total: calculateCartTotal(cartItems),
            },
            include: { cartItem: true },
          });
          res.send({ message: "Cart item created", data: updatedCart });
        }
      });
    }
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

const deleteAllCartItemsByCartId = async (req, res, next) => {
  const { cartId } = req.params;
  try {
    const response = await db.cartItem.deleteMany({ where: { cartId } });
    const updatedCart = await db.cart.findFirst({
      where: { id: cartId },
      include: { cartItem: true },
    });
    res.send({ message: "Deleted all items in the Cart", data: updatedCart });
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
  deleteAllCartItemsByCartId,
  updateCartItemById,
};
