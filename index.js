const express = require("express");
const app = new express();
const port = 3012;

app.use(express.json());

app.use("/api/user", require("./routes/user.route"));
app.use("/api/owner", require("./routes/owner.route"));
app.use("/api/restaurant", require("./routes/restaurant.route"));
app.use("/api/menu", require("./routes/menu.route"));
app.use("/api/cart", require("./routes/cart.route"));

app.listen(port, () => console.log(`Server started on post : ${port}`));
