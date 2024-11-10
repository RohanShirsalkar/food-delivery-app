const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const create = async (req, res, next) => {
  const { code, discount, discountType, status, restaurantId } = req.body;
  try {
    if (!restaurantId) {
      return next(createError(428, "Restaurant ID is required"));
    }
    if (!code || !discount) {
      return next(createError(401, "All fields are required"));
    }
    const couponExists = await db.coupon.findFirst({ where: { code } });
    if (couponExists) {
      return next(createError(409, "Coupon already exists with this code."));
    }
    const coupon = await db.coupon.create({
      data: { code, discount, discountType, status, restaurantId },
    });
    res.send({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findCouponsByRestaurantId = async (req, res, next) => {
  const { restaurantId } = req.params;
  try {
    if (!restaurantId) {
      return next(createError(428, "Restaurant ID is required"));
    }
    const restaurantExists = await db.restaurant.findFirst({
      where: { id: restaurantId },
    });
    if (!restaurantExists) {
      return next(createError(428, "Restaurant not found"));
    }
    const coupons = await db.coupon.findMany({ where: { restaurantId } });
    res.send({ message: "Coupons fetched successfully", data: coupons });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(createError(428, "Coupon ID is required"));
    }
    const coupon = await db.coupon.findFirst({ where: { id } });
    res.send({ message: "Coupon fetched successfully", data: coupon });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { create, findCouponsByRestaurantId, findById };
