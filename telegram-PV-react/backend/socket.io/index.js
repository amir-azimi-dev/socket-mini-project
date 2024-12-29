const { initiateConnection, sendPrivateChat } = require("./namespace.socket");

const executeSocketIo = async io => {
    initiateConnection(io);
    sendPrivateChat(io);
};

module.exports = executeSocketIo;