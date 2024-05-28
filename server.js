const express = require("express");
const cors = require("cors");
// const db = require("./Database/database");

db = require("./Database/database");
const routes = require("./router");

const app = express();

app.use(cors());
app.use("/api", routes);

try {
  db.connect();
} catch (error) {
  console.error(error);
}

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

module.exports = app;
