const http = require("http");
const logger = require("morgan");
const express = require("express");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
require("dotenv/config.js");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
const PORT = process.env.PORT || 3001;

// routes
const index_routes = require("./routes/index.routes");

app.use("/api/v1", index_routes);

// db connection
mongoose
  .connect("mongodb://0.0.0.0:27017/userData")
  .then(() => console.log("MongoDb : START"));

server.listen(PORT, console.log(`Server @${PORT}`));
