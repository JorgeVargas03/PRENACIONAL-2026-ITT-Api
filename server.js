require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const socketManager = require("./socket/socketManager");
const authRoutes = require("./auth/auth.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map(o => o.trim()).filter(Boolean);
app.use(cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: corsOrigins.length ? corsOrigins : true,
        credentials: true
    }
});

socketManager(io);
app.use(authRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
})

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});