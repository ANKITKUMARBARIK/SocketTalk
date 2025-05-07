const http = require("http")
const express = require("express")
const { Server } = require("socket.io");

const app = express()      // express() -> (req,res)=>{} ..that's why we use express
const PORT = 8000
const server = http.createServer(app)   // look like -> http.createServer((req,res)=>{})
const io = new Server(server)   // craete WebSocket server

let onlineUsers = 0

// Socket.io Handles
io.on('connection', (socket) => {
    // console.log('A new user has connected: ',socket.id);

    // online feature..
    onlineUsers++
    io.emit("online-users", onlineUsers)

    // offline feature..
    socket.on("disconnect", () => {
        // console.log('user disconnected')
        onlineUsers--
        io.emit("online-users", onlineUsers)
    })

    // chatting feature..
    socket.on('user-message', (message) => {
        // console.log('A new user message: ',message)
        io.emit('message', message)
    })
})

// io.emit() → Sab clients ko bhejna
// socket.emit() → Sirf ek client ko bhejna
// socket.on("event") → Client ya server se message sunna



// http req - Express Handles
const path = require("path");
app.use(express.static(path.resolve("./public")))

// routes -> 
app.get('/', (req, res) => {
    return res.sendFile("./public/index.html")
})


server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))


// socket.on("disconnect", () => { ... })
// 🔹 Jab bhi koi client (browser tab/user) disconnect karega — yaani:

// Page close karega
// Refresh karega
// Network chala jaayega
// Tab ye function automatically call hoga.