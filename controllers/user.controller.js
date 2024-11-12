const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

// Creating a new user will also create a new cart and associated with it in the database.
const registerUser = async (req, res, next) => {
  const { phone, email, password } = req.body;
  try {
    if (!phone || !email || !password) {
      return next(createError(422, "Missing information"));
    }
    const user = await db.user.create({
      data: { phone, email, password },
    });
    const cart = await db.cart.create({
      data: { userId: user.id },
    });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(createError(422, "Id is required"));
    }
    // do not include cart items
    const user = await db.user.findUnique({
      where: { id },
      include: { cart: { include: { cartItem: true } } },
    });
    if (!user) {
      return next(createError(422, "user not found"));
    }
    res.send({ message: "User found successfully", data: user });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { registerUser, findById };
