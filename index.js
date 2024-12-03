const express = require("express");
const createError = require("http-errors");
const app = new express();
const cors = require("cors");

const port = 3012;

app.use(express.json());
app.use(cors());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/owner", require("./routes/owner.route"));
app.use("/api/restaurant", require("./routes/restaurant.route"));
app.use("/api/menu", require("./routes/menu.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/order", require("./routes/order.route"));
app.use("/api/address", require("./routes/address.route"));
app.use("/api/coupon", require("./routes/coupon.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
    error: err.error,
  });
});

app.listen(port, () => console.log(`Server started on post : ${port}`));
