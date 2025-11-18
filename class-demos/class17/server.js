const express = require("express")

const bodyParser = require("body-parser")
const nedb = require("@seald-io/nedb")

const app = express()

app.use(express.static("public"))

//adding middleware to be able to parse body data from the fetch requests
app.use(bodyParser.json())

const database = new nedb({
    filename: "database.txt", 
    autoload: true
})


app.get("/all-posts", (req, res) => {
    let allPosts = [
        {text: "Post 1"},
        {text: "Post 2"},
        {text: "Post 3"},
    ]
    //send back the data as json 
    res.json({posts: allPosts})
})

app.listen(7001, () => {
    console.log("Server started on port 7001")
})

