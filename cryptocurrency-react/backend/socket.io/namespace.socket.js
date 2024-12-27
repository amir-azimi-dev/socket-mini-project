const coins = require("../db.json");

const handleConnection = io => {
    io.on("connection", client => {
        sendShuffledCoins(client);
        
        setInterval(() => {
            sendShuffledCoins(client);

        }, 1000)
    });
};

const sendShuffledCoins = client => {
    const shuffledCoins = [...coins].sort(() => Math.random() - 0.5);
    client.emit("coin-data", shuffledCoins);
};

module.exports = {
    handleConnection
};