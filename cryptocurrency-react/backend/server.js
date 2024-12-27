require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectIo = require("./socket.io/connectIo");
const executeIo = require("./socket.io");

const connectIO = () => {
    const server = http.createServer(app);
    const io = connectIo(server);
    executeIo(io);
    return server;
};


const startServer = async () => {
    const server = connectIO();

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log("-----------------------------\n");
        console.log(`Server is running on port ${port} ...`);
    });
};

startServer();