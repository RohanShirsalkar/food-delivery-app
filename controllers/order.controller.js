const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const createOrder = async (req, res, next) => {
  const {
    userId,
    restaurantId,
    paymentMethod,
    items,
    cartTotal,
    deliveryCharges,
    addressId,
    couponId,
  } = req.body;
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
      data: {
        userId,
        restaurantId,
        paymentMethod,
        cartTotal,
        total: calculateTotal({ cartTotal, deliveryCharges, couponId }),
        addressId,
        couponId,
        deliveryCharges,
      },
      include: {
        items: true,
        coupon: true,
        address: true,
        restaurant: true,
        user: true,
      },
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

// @desc calculate order amount after delivery charges and coupons are applied.
const calculateTotal = async ({ couponId, cartTotal, deliveryCharges }) => {
  let total = 0;
  if (couponId) {
    const coupon = await db.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) {
      return next(createError(404, "Coupon not found"));
    }
    if (coupon.status !== "ACTIVE") {
      return res.send({ message: "Coupon is not active.", data: coupon });
    }
    if (coupon.discountType === "PERCENTAGE") {
      total +=
        cartTotal + deliveryCharges - (cartTotal * coupon.discount) / 100;
    } else if (coupon.discountType === "AMOUNT") {
      total += cartTotal + deliveryCharges - coupon.discount;
    }
  } else {
    total = cartTotal + deliveryCharges;
  }
  return total;
};

module.exports = { createOrder, getOrdersByUserId };
