//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



//-----------------------ROUTES -------------------------------


const day = date.getDate();

app.get("/", function(req, res) {

  Item.find({}, function(err, results) {
    res.render("list", {
      listTitle: day,
      newListItems: results
    });
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);


  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: []
        });

        list.save();
        res.redirect("/" + customListName);

      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});


app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  if (itemName.length > 2) {
    const item = new Item({
      name: itemName,
    });

    if (listName === day) {
      item.save();
      res.redirect("/");
      console.log("Item added to main list!")
    } else {
      List.findOne({
        name: listName
      }, function(err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
        console.log("Item added to custom list!");
      })

    }
  } else {
    console.log("Please enter something valid");
  }
});

app.post("/delete",
  function(req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
      Item.findByIdAndRemove(checkedItemID, function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
          console.log("Item deleted succcessfully");
        }
      });
    } else {
      List.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemID
          }
        }
      }, function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
          console.log("Item deleted succcessfully from custom list");
        }
      });
    }
  });


app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});