const express = require("express");
const app = new express();
const port = 3012;

app.use("/user", require("./routes/user.route"));
app.use("/owner", require("./routes/owner.route"));
app.use("/restaurant", require("./routes/restaurant.route"));
app.use("/menu", require("./routes/menu.route"));

app.listen(port, () => console.log(`Server started on post : ${port}`));
