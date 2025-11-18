//This is the only way you should load the webpage
window.onload = () =>{
    let button1 = document.getElementById("hi")
    button1.addEventListener("click", hiButton)
    
    button1.addEventListener("click", ()=>{console.log("Hi button was pressed with anon function")})
    
    //shorthand for event name using anon function
    button1.onclick = () => {
        console.log("HII button pressed with shorthand anon button")

        let rotate = document.getElementById("rotate")
        rotate.style.display = "block"
        rotate.style.backgroundColor = "cyan"
    }

    let button2 = document.getElementById("wassuh")
    button2.onclick = () => {
        let rotate = document.getElementById("rotate")

        let leftPos = 0
        let speed = 1
        //only way we are managing time in this class 
        setInterval( ()=> {
            leftPos += speed
            if (leftPos > window.innerWidth - 100 || leftPos < 0){
                speed *= -1
            }
            rotate.style.left = leftPos
        },  10)
    }
}

function hiButton(){
    console.log("hi button was pressed")
}