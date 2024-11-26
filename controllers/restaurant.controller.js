const { PrismaClient } = require("@prisma/client");
const createError = require("http-errors");

const db = new PrismaClient();

const create = async (req, res, next) => {
  const { ownerId, name, address, city } = req.body;
  try {
    if (!ownerId) {
      return next(createError(422, "Owner id is required"));
    }
    if (!name || !city) {
      return next(createError(422, "Name and city are required"));
    }
    const restaurant = await db.restaurant.create({
      data: { owner_id: ownerId, name, address, city },
    });
    res.send({
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findByOwnerId = async (req, res, next) => {
  const { ownerId } = req.params;
  try {
    if (!ownerId) {
      return next(createError(422, "Owner id is required"));
    }
    const restaurants = await db.restaurant.findMany({
      where: { owner_id: ownerId },
    });
    if (!restaurants) {
      return next(createError(422, "Restaurants not found"));
    }
    res.send({ message: "Restaurant found successfully", data: restaurants });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findByCityId = async (req, res, next) => {
  const { cityId } = req.params;
  try {
    if (!cityId) {
      return next(createError(422, "City is required"));
    }
    const restaurants = await db.restaurant.findMany({
      where: { city: cityId },
    });
    res.send({ message: "Restaurants found successfully", data: restaurants });
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
    const restaurant = await db.restaurant.findUnique({
      where: { id },
      include: { menu: true },
    });
    if (!restaurant) {
      return next(createError(422, "Restaurant not found"));
    }
    res.send({ message: "Restaurant found successfully", data: restaurant });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

// @name Search restaurants by the item type.
// @desc Find all restaurant that have a specific item type in their menu.
const findByItemType = async (req, res, next) => {
  const { itemType } = req.params;
  try {
    if (!itemType) {
      return next(createError(422, "Item type is required."));
    }
    const restaurants = await db.restaurant.findMany({
      include: { menu: { where: { type: itemType } } },
      where: { menu: { some: { type: itemType } } },
    });
    res.send({ message: "Restaurants found successfully", data: restaurants });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

const findBySearchQuery = async (req, res, next) => {
  const { query } = req.params;
  try {
    if (!query) {
      return next(createError(422, "Item type is required."));
    }
    const restaurants = await db.restaurant.findMany({
      where: { menu: { some: { name: { contains: query } } } },
      include: { menu: { where: { name: { contains: query } } } },
    });
    res.send({ message: "Restaurants found successfully", data: restaurants });
  } catch (error) {
    console.log(error);
    next(createError(500, "Internal server error"));
  }
};

module.exports = {
  findByOwnerId,
  findByCityId,
  findById,
  create,
  findByItemType,
  findBySearchQuery,
};
