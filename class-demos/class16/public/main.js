window.onload = () => {
    refreshMessages()
}

async function refreshMessages() {
    //the url i am retreiving on my server
    const url = "/all-posts"

    //this retreives my data from my url
    const response = await fetch(url)
    const data = await response.json()
    console.log(data.posts)
}