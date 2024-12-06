const router = require("express").Router();
const {
  findByOwnerId,
  findByCityId,
  findById,
  create,
  findByItemType,
  findBySearchQuery,
} = require("../controllers/restaurant.controller");

router.post("/", create);
router.get("/city/:cityId", findByCityId);
router.get("/:id", findById);
router.get("/owner/:ownerId", findByOwnerId);
router.get("/item-type/:itemType", findByItemType);
router.get("/search-item/:query/:location", findBySearchQuery);
module.exports = router;
