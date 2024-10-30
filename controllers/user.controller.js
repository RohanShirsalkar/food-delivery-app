const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(createError(422, "Missing information"));
    }
    const owner = await db.owner.create({ data: { name, email, password } });
    res.send({
      message: "User registered successfully",
      owner: owner,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

// Meghana
// find user by id

module.exports = { registerUser };
