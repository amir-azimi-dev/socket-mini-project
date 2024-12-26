const userModel = require("../app/models/user");

const initiateConnection = io => {
    io.on("connection", async client => {
        const userData = await userModel.find().sort({ createdAt: -1 });
        client.emit("private-chats", userData);
    });
};

const sendPrivateChat = io => {
    io.of("pvs").on("connection", pvSocket => pvSocketHandler(io, pvSocket));
};

const pvSocketHandler = (io, pvSocket) => {
    transferMessageHandler(io, pvSocket);
    removeMessageHandler(io, pvSocket);

    pvSocket.on("join", async data => {
        const { sender, receiver } = data;

        const prevChats = Array.from(pvSocket.rooms);
        if (prevChats.length === 3) {
            pvSocket.leave(prevChats[1])
            pvSocket.leave(prevChats[2])
        }

        pvSocket.join(`${sender}-${receiver}`);
        pvSocket.join(`${receiver}-${sender}`);

        pvSocket.emit("pv-info", data);
    });
};

const transferMessageHandler = (io, pvSocket) => {
    pvSocket.on("send-message", async data => {
        const { message, pv: { sender, receiver } } = data;
        if (!message || !sender || !receiver) {
            return;
        }

        const messageId = crypto.randomUUID();

        io
            .of("/pvs")
            .in(`${sender}-${receiver}`)
            .in(`${receiver}-${sender}`)
            .emit("confirm-message", { ...data, messageId });
    });
};

const removeMessageHandler = (io, pvSocket) => {
    pvSocket.on("remove-message", async messageId => {
        const rooms = Array.from(pvSocket.rooms);
        io
            .of("/pvs")
            .in(rooms[1])
            .in(rooms[2])
            .emit("confirm-remove-message", messageId);
    });
};

module.exports = {
    initiateConnection,
    sendPrivateChat
};