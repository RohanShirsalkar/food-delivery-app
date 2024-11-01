const router = require("express").Router();
const {
  findByOwnerId,
  findByCityId,
  findById,
  create,
} = require("../controllers/restaurant.controller");

router.post("/", create);
router.get("/city/:cityId", findByCityId);
router.get("/:id", findById);
router.get("/owner/:id", findByOwnerId);

module.exports = router;
