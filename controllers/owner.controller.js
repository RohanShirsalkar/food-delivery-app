const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const registerOwner = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(createError(422, "Missing information"));
    }
    const owner = await db.owner.create({ data: { name, email, password } });
    return res.send({
      message: "Owner registered successfully",
      owner: owner,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = { registerOwner };
