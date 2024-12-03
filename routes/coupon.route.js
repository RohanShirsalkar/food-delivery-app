const router = require("express").Router();
const {
  create,
  findCouponsByRestaurantId,
  findById,
  findCouponByCode,
} = require("../controllers/coupon.controller");

router.post("/", create);
router.get("/restaurant/:restaurantId", findCouponsByRestaurantId);
router.get("/search/:code", findCouponByCode);
router.get("/coupon/:id", findById);

module.exports = router;
