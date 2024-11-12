const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const create = async (req, res, next) => {
  const { city, street, pincode, userId } = req.body;
  try {
    if (!userId) {
      return next(createError(422, "User ID is required"));
    }
    if (!city || !street || !pincode) {
      return next(createError(422, "Invalid input data"));
    }
    const address = await db.address.create({
      data: { city, street, pincode, userId },
    });
    res.send({ message: "Address created successfully", data: address });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { registerOwner };
