//Import express
const express = require("express")

//setting up body parser library
const parser = require("body-parser")
const encodedParser = parser.urlencoded({extended: true})

//setting up multer library
const multer = require("multer")
const uploadProcessor = multer( {dest: "assets/upload/" })

//instance of express
const app = express()

//middleware to set up public folder to serve basic html files
app.use(express.static("assets"))
app.use(encodedParser)
//setting the templating engine to use ejs
app.set("view engine", "ejs")

//array to store all messages from
let messages = []

let posts = []

app.get("/", (request, response)=>{
    //response.send("server working")
    //response.sendFile('htmls/guestbook.html', {root:})


    let data ={
        message: "hello",
        paths: ["path1","path2","path3"]

    }

    data.visible = true
    // 2 params:
    // #1: name of the .ejs file that exists in views
    // #2: data to be sent as 
    response.render("template.ejs", data)
})


app.get("/submit", (request, response)=>{
    //query is everything that comes after the ? in the url
    console.log(request.query.guest)

    let guest = request.query.guest

    //Object that holds the data that comes in from one form request
    let messageData = {
        username: request.query.guest,
        text: request.query.message
    }

    messages.push(messageData)

    response.send("thank you for writing a message," + guest)
})

//new route that goes after the submit route
app.get("/all-messages", (request, response)=>{
    let allMessages = ""
    for( let m of messages){
        allMessages += m.username + "says" + m.text + "<br/>"
    }
    response.send(allMessages)
})


app.get("/post", (req,res)=>{

    //all posts will be accessed on the ejs side
    // posts is the current array in the server
    let data = {
        allPosts : posts
    }

    res.render("post.ejs", data)
})

app.post("/upload",uploadProcessor.single("theImage"),(req,res)=>{
    console.log(req.body)

    let singlePost = {
        text: req.body.status,
    }

    let date = new Date()
    singlePost.time = date.toLocaleString()

    if(req.file){
        singlePost.imgSrc = "/upload/" + req.file.filename
    }


    posts.unshift(singlePost)

    res.redirect("/post")
})
//set up server
app.listen(6001, ()=>{
    console.log("server started")
})