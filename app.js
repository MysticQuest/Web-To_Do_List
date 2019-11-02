//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//DB CONNECT

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect("mongodb://localhost:27017/todolistDB", options, function(err) {
  if (err) {
    console.log(err + " - FAILED TO CONNECT");
  } else {
    console.log("connection to DB successful");
  }
});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "Error - Blank Entry"]
  }
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Lalallalalal"
});

const item2 = new Item({
  name: "Xixixiixixixi"
});

const defaultItems = [item1, item2]

/*Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Items added");
  }
});*/

Item.find({}, function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);
  }
});

//routes

app.get("/", function(req, res) {

  const day = date.getDate();

  res.render("list", {
    listTitle: day,
    newListItems: items
  });

});

app.post("/", function(req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});