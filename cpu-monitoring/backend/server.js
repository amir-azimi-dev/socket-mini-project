require("dotenv").config();
const app = require("./app");
const http = require("http");
const connectIo = require("./app/socket.io/connectIo");
const handleIo = require("./app/socket.io");

const server = http.createServer(app);
const io = connectIo(server);
handleIo(io);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("---------------------------------------");
    console.log(`Server is running on port ${PORT} ...`);
});