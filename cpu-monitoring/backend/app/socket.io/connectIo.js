const socketIo = require("socket.io");

const connectIo = httpServer => {
    const io = socketIo(httpServer, {
        cors: {
            origin: "*"
        }
    });

    return io;
};

module.exports = connectIo;