require('dotenv').config()
const express = require('express');
const { Server } = require("socket.io")
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User Joined", socket.id);

    socket.on("send-message", ({ room, message }) => {
        console.log({ room, message });
        io.to(room).emit("receive-message", message);
    });

    socket.on("join-room", room => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User leaved", socket.id);
    });

});

server.listen(port, () => {
    console.log(`Gossip backend is running on port ${port}`);
});
