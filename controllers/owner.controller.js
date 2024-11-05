const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const registerOwner = async (req, res, next) => {
  const { phone, email, password } = req.body;
  try {
    if (!phone || !email || !password) {
      return next(createError(422, "Missing information"));
    }
    const ownerWithEmailExists = await db.owner.findUnique({
      where: { email },
    });
    const ownerWithPhoneExists = await db.owner.findUnique({
      where: { phone },
    });
    if (ownerWithEmailExists) {
      return next(createError(422, "Email already exists in the database."));
    }
    if (ownerWithPhoneExists) {
      return next(
        createError(422, "Phone number already exists in the database.")
      );
    }
    const owner = await db.owner.create({ data: { phone, email, password } });
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
