// how do we know this is a npm project?
// A: 

// what command do we run to start an npm project?
// A: npm init

// what does the below chunk of code do?
// A: imports needed libraries

const express = require("express"); 
const multer = require("multer");   
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb")

// what does this line do?
// A: creates a parser for url encoded data
const urlEncodedParser = bodyParser.urlencoded({ extended: true }); 

// what is app?
// A: creates an express app
const app = express();

// what is this configuring?
// A: configures multer to save uploaded files to the public/uploads directory
const upload = multer({
  dest: "public/uploads",
});

// what is this configuring?
// A: configures nedb and creates a new database

let database = new nedb({
  filename: "database.txt",
  autoload: true 
})

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static("public"));    // A: servers files from public
app.use(urlEncodedParser);            // A: parses url encoded data
app.set("view engine", "ejs");        // A: sets ejs as the view engine

// what type of request is this? what does it do?
// A: GET, renders the index.ejs file
app.get("/", (request, response) => {

  // how does this database search work?
  // A: searches the database for all posts
  let query = {} 
  database.find(query).exec( (err, data)=>{
    response.render('index.ejs', {posts: data})
  } )
});

// what are the three parameters in this function?
// A: 
app.post("/upload", upload.single("theimage"), (req, res)=>{

  let currentDate = new Date()

  // what type of data structure is this?
  // A: object
  let data = {
    text: req.body.text,
    date: currentDate.toLocaleString(),
    timestamp: currentDate.getTime()
  }

  // why do we write this if statement?
  // A: to check if a file is uploaded
  if(req.file){
    data.image = "/uploads/" + req.file.filename
  }

  // what parameters go into this insert function?
  // A: data, callback function
  database.insert(data, (err, newData)=>{
    console.log(newData)
    res.redirect("/")
  })
})

// what does the number signify?
// A: Port where server runs
// how do we access this on the web?
// A: http://localhost:6001
app.listen(6001, () => {
  console.log("server started on port 6001");
});
