const router = require("express").Router();
const {
  create,
  findByCity,
  findById,
  findByOwnerId,
} = require("../controllers/restaurant.controller");

router.post("/", create);
router.get("/city/:city", findByCity);
router.get("/:id", findById);
router.get("/owner/:id", findByOwnerId);

module.exports = router;
