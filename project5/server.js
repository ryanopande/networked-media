/*********************************************
library imports
*********************************************/
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb");

/*********************************************
library configurations
*********************************************/
const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

//static folders
app.use(express.static("public"));    
app.use("/uploads", express.static("uploads")); 

// set view engine
app.set("view engine", "ejs");

// configure multer to save uploaded files in /uploads
const upload = multer({
  dest: "uploads",
});

// nedb database for moments
let database = new nedb({
  filename: "moments.txt",
  autoload: true,
});

// middleware
app.use(urlEncodedParser);

/*********************************************
ROUTES
*********************************************/

// HOME PAGE
app.get("/", (req, res) => {
  let query = {};

  database.find(query).exec((err, data) => {
    // if there is an error, just use empty array
    if (err) {
      data = [];
    }

    // sort by newest first and take a few recent moments
    data.sort((a, b) => b.timestamp - a.timestamp);
    let recentMoments = data.slice(0, 4);

    res.render("index.ejs", { recentMoments: recentMoments });
  });
});

// MAP PAGE
app.get("/map", (req, res) => {
  let query = {};

  database.find(query).exec((err, data) => {
    if (err) {
      data = [];
    }

    res.render("map.ejs", { allMoments: data });
  });
});

// ABOUT PAGE
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

/*********************************************
ADD NEW MOMENT
*********************************************/

app.post(
  "/moment",
  upload.fields([
    { name: "image", maxCount: 1 }
  ]),
  (req, res) => {
    let currentDate = new Date();

    let newMoment = {
      caption: req.body.caption,
      lat: parseFloat(req.body.lat),
      lng: parseFloat(req.body.lng),
      timestamp: currentDate.getTime(),
      likes: 0,
      comments: [],
    };

    // add image path if uploaded
    if (req.files && req.files.image && req.files.image[0]) {
      newMoment.image = "/uploads/" + req.files.image[0].filename;
    }

    database.insert(newMoment, () => {
      res.redirect("/map");
    });
  }
);

/*********************************************
LIKE A MOMENT
*********************************************/

app.post("/moment/:id/like", (req, res) => {
    let momentId = req.params.id;
  
    let query = { _id: momentId };
    let update = { $inc: { likes: 1 } };
  
    database.update(query, update, {}, () => {
      // find the updated document and send the new like count
      database.findOne(query, (err, updatedMoment) => {
        if (err || !updatedMoment) {
          res.json({ likes: 0 });
        } else {
          res.json({ likes: updatedMoment.likes });
        }
      });
    });
  });
  
/*********************************************
ADD COMMENT TO A MOMENT
*********************************************/

app.post("/moment/:id/comment", (req, res) => {
    let momentId = req.params.id;
    let commentText = req.body.commentText;
  
    if (!commentText || commentText.trim() === "") {
      return res.json({ success: false });
    }
  
    let newComment = {
      text: commentText.trim(),
      createdAt: Date.now()
    };
  
    let query = { _id: momentId };
    let update = { $push: { comments: newComment } };
  
    database.update(query, update, {}, () => {
      // send the comment back so frontend can add it
      res.json({ success: true, comment: newComment });
    });
  });
  

/*********************************************
SERVER LISTENER
*********************************************/
app.listen(6001, () => {
  console.log("server started on port 6001");
});
