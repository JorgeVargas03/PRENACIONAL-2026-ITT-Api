const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const socketManager = require("./socket/socketManager");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

socketManager(io);

app.get("/", (req, res) => {
    res.send("Server is running");
})

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});