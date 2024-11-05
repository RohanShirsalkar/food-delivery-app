const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const createOrder = async (req, res, next) => {
  const { userId, restaurantId, paymentMethod, items } = req.body;
  try {
    if (!userId || !restaurantId || !paymentMethod) {
      return next(
        createError(422, "Missing required parameters in the request body.")
      );
    }
    if (items.length < 1) {
      return createError(422, "At least one item should be added in the order");
    }
    const order = await db.order.create({
      data: { userId, restaurantId, paymentMethod },
      include: { items: true },
    });
    const orderItems = await Promise.all(
      items.map((item) => {
        return db.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      })
    );
    res.send({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const getOrdersByUserId = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return next(
        createError(422, "Missing required parameters in the request body.")
      );
    }
    const orders = await db.order.findMany({ where: { userId } });
    res.send({ message: "Orders fetched successfully", data: orders });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { createOrder, getOrdersByUserId };
