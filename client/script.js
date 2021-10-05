const SERVER_URL = "http://localhost:5000"
const socket = io(SERVER_URL)

const inputForm = document.getElementById("inputForm")
const usersCount = document.getElementById("usersCount")

let users_count
let registered = false

function displayYourChat(yourChat){
    const chatContainer = document.createElement("div")
    chatContainer.className = "yourChat"
    const chat = document.createElement("p")
    chat.textContent = yourChat
    const sender = document.createElement("small")
    sender.innerHTML = "You"
    chatContainer.appendChild(chat)
    chatContainer.appendChild(sender)
    document.getElementById("chatsContainer").appendChild(chatContainer)

    const chatsDiv = document.getElementById("chatsContainer")
    chatsDiv.scrollTop = chatsDiv.scrollHeight
}

function displayOthersChat(othersChat){
    const chatContainer = document.createElement("div")
    chatContainer.className = "othersChat"
    const chat = document.createElement("p")
    chat.textContent = othersChat.chat
    const sender = document.createElement("small")
    sender.textContent = othersChat.name
    chatContainer.appendChild(chat)
    chatContainer.appendChild(sender)
    document.getElementById("chatsContainer").appendChild(chatContainer)

    const chatsDiv = document.getElementById("chatsContainer")
    chatsDiv.scrollTop = chatsDiv.scrollHeight
}

inputForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if(registered === false){
        const userName = e.target.formInput.value
        socket.emit("new-user", userName)
        e.target.formInput.value = ""
        displayYourChat("You joined as " + userName)
    
        users_count += 1
        usersCount.innerHTML = users_count
        inputForm.className = "chat-form"
        inputForm.formInput.placeholder = "Aa"
        inputForm.formBtn.innerHTML = "Send"
        registered = true
    } else {
        const userChat = e.target.formInput.value.toString()
        e.target.formInput.value = ""

        socket.emit("new-chat", userChat)
        displayYourChat(userChat)
    }
})

socket.on("connect", () => {
    socket.on("users-count", (count) => {
        users_count = count
        usersCount.innerHTML = users_count
    })
})

socket.on("added-new-user", (user) => {
    users_count += 1;
    usersCount.innerHTML = users_count.toString()

    displayOthersChat({name: user, chat: user + " joined"})
})

socket.on("added-new-chat", (chat) => {
    displayOthersChat(chat)
})

socket.on("user-disconnected", (userName) => {
    users_count -= 1
    usersCount.innerHTML = users_count
    displayOthersChat({name: userName, chat: userName + " disconnected"})
})