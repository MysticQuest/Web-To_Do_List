const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = [];

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  //res.sendFile(__dirname + "/index  .html");

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  var day = new Date().toLocaleDateString("en-US", options);

  res.render('list', {
    kindOfDay: day,
    newListItems: items
  });

});

app.post("/", function(req, res) {
  var item = req.body.newItem;

  items.push(item);
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port: 3000");
});