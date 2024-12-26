const { handleConnection } = require("./namespace.socket.js")

const executeIo = io => {
    handleConnection(io);
};

module.exports = executeIo;