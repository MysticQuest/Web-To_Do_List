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
    console.log("Connection to DB successful");
  }
});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "Error - Blank Entry"]
  }
};

const Item = mongoose.model("item", itemsSchema);

//routes

app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({}, function(err, results) {
    res.render("list", {
      listTitle: day,
      newListItems: results
    });
  });
});



app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  if (itemName.length > 2) {
    const item = new Item({
      name: itemName,
    });
    item.save();
    console.log("Item saved successfully!");
    res.redirect("/");
  } else {
    console.log("Please enter something valid");
  }
});

app.post("/delete",
  function(req, res) {
    const checkedItemID = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemID, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
        console.log("Item deleted succcessfully");
      }
    });
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