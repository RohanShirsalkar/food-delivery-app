const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const createMenuItem = async (req, res, next) => {
  const { restaurantId, name, price, description, available } = req.body;
  try {
    if (!restaurantId) {
      return next(createError(422, "Restaurant id is required."));
    }
    if (!name || !price || !description) {
      return next(
        createError(422, "Name, Price and Description are required.")
      );
    }
    const menuItem = await db.menuItem.create({
      data: {
        restaurantId,
        name: name,
        price: price,
        description: description,
        available: available,
      },
    });
    res.send({
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

// Meghana
// find menu all items
// find menu items by restaurant id. reference: const restaurants = await db.restaurant.findUnique({ where: { city: city } });

module.exports = { createMenuItem };
