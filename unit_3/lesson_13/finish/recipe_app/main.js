"use strict";

const express = require("express"),
  app = express(),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),
  MongoDB = require("mongodb").MongoClient,
  // start emulator in administrator
  // CosmosDB.Emulator.exe /EnableMongoDbEndpoint /DataPath=%LOCALAPPDATA%\CosmosDbEmulator
  // https://docs.mongodb.com/manual/reference/connection-string/
  // If the username or password includes the at sign @, colon :, slash /,
  // or the percent sign % character, use percent encoding
  // original connection string : 
  // mongodb://localhost:C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==@localhost:10255/admin?ssl=true
  // escape / as %2F
  // port changes to 10250
  // mongodb://username:password@host:port/database?options...
  dbURL = "mongodb://localhost:C2y6yDjf5%2FR+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw==@localhost:10250/recipe_db?ssl=true",
  dbName = "recipe_db";

var options = {
  replSet: {
      sslValidate: false
    }
  };

MongoDB.connect(
  dbURL,
  options,
  (error, client) => {
    if (error) throw error;
    let db = client.db(dbName);
    db.collection("contacts")
      .find()
      .toArray((error, data) => {
        if (error) throw error;
        console.log(data);
      });

    db.collection("contacts").insert(
      {
        name: "Freddie Mercury",
        email: "fred@queen.com"
      },
      (error, db) => {
        if (error) throw error;
        console.log(db);
      }
    );
  }
);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(homeController.logRequestPaths);

app.get("/name", homeController.respondWithName);
app.get("/items/:vegetable", homeController.sendReqParam);

app.post("/", (req, res) => {
  console.log(req.body);
  console.log(req.query);
  res.send("POST Successful!");
});

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
