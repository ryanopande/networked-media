//imports the configurations set up in the .env
import dotenv from "dotenv"
dotenv.config()

//connects to mastadon
import { createRestAPIClient} from "masto"

//stores login info and server we are connecting to
const masto = createRestAPIClient({
    url : "https://networked-media.itp.io/",
    accessToken : process.env.TOKEN // accessing TOKEN in .env file
})

//add request to a database
async function retrieveData() {
    const url = "http://68.183.19.218:8000/all-messages"
    const response = await fetch(url)
    const json = await response.json()

    const posts = json.messages
    //const posts = [{text: "1"},{text: "2"},{text: "3"},{text: "4"}]
    let randNum = Math.floor(Math.random() * (posts.length))
    let randText = posts[randNum].text
    makeStatus(randText)

}

async function makeStatus(textStatus) {
    const status = masto.v1.statuses.create({
        status : textStatus,
        visibility : "public" //change to public after testing

    })

    console.log(status.url)
}

setInterval(()=>{
    //makeStatus()
    retrieveData()
},(60 * 60 * 1000))


//retrieveData()
//makeStatus()

