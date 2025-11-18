//imports the configurations set up in the .env
require("dotenv").config()

const m = require("masto")

const masto = m.createRestAPIClient({
    url : "https://networked-media.itp.io/",
    accessToken : process.env.TOKEN
})

async function makeStatus() {
    const status = masto.v1.statuses.create({
        status : "hi this is a test",
        visibility : "private" //change to public after testing

    })

    console.log(status.url)
}

setInterval(()=>{
    makeStatus()
},1000)

//makeStatus()

