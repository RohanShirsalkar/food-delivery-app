const express = require("express");
const app = new express();
const port = 3012;

app.use(express.json());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/owner", require("./routes/owner.route"));
app.use("/api/restaurant", require("./routes/restaurant.route"));
app.use("/api/menu", require("./routes/menu.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/order", require("./routes/order.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(port, () => console.log(`Server started on post : ${port}`));
