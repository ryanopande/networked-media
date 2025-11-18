const express = require("express");
// added body parser and nedb libraries
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb");

const app = express();

app.use(express.static("public"));
// adding middleware to be able to parse body data from the fetch requests
app.use(bodyParser.json());

//adding view engine
app.set("view engine", "ejs")

// set up the database file
const database = new nedb({
  filename: "database.txt",
  autoload: true,
});

//route to get the /add url
//this renders the form.ejs!
app.get("/add", (req,res)=>{
  res.render("form.ejs")
})

app.get("/all-posts", (req, res) => {
  // let allPosts = [
  //     {text: "post 1"},
  //     {text: "post 2"},
  //     {text: "post 3"},
  // ]

  let query = {}; // this is empty because we don't want to get any specific thing

  database.find(query).exec((err, data) => {
    // send data back as json
    res.json({ posts: data });
  });
});

app.listen(7001, () => {
  console.log("server running on http://127.0.0.1:7001");
});
