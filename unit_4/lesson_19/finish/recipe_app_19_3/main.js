"use strict";

const express = require("express"),
  app = express(),
  router = express.Router(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  Subscriber = require("./models/subscriber");
mongoose.Promise = global.Promise;

require('dotenv').config();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("connectionString", process.env.CONNECTIONSTRING || "mongodb://localhost:27017/recipe_db")

// https://mongoosejs.com/docs/connections.html

// If initial connection fails, Mongoose will not attempt to reconnect
// Error after initial connection was established. Mongoose will attempt to reconnect

// mongoose.connect() creates default connection mongoose.connection, it is a pool of socket connections
// mongoose.createConnection() creates new connection(a pool of socket connections)

var options = {
  replSet: {
    sslValidate: false
  },
  useNewUrlParser: true
};

mongoose.connect(
  app.get("connectionString"),
  options
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);

router.use(express.json());
router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);

router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
