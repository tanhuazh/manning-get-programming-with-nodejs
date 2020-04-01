"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  subscribersController = require("./controllers/subscribersController"),
  layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

var options = {
  replSet: {
    sslValidate: false
  },
  useNewUrlParser: true
};

// mongodb://username:password@host:port/database?options...
mongoose.connect(
  "mongodb://localhost:C2y6yDjf5%2FR+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw==@localhost:10250/confetti_cuisine?ssl=true",
  options
);

mongoose.set("useCreateIndex", true);
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.get("/courses", homeController.showCourses);
app.post("/contact", homeController.postedSignUpForm);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
