const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const create = async (req, res, next) => {
  const { label, city, street, pinCode, userId } = req.body;
  try {
    if (!userId) {
      return next(createError(422, "User ID is required"));
    }
    if (!city || !street || !pinCode) {
      return next(createError(422, "Invalid input data"));
    }
    const address = await db.address.create({
      data: { label, city, street, pinCode, userId },
    });
    const updatedAddress = await db.address.findMany({ where: { userId } });
    res.send({ message: "Address created successfully", data: updatedAddress });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return next(createError(422, "User ID is required"));
    }
    const address = await db.address.findMany({ where: { userId } });
    res.send({ message: "Address fetched successfully", data: address });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { create, findByUserId };
