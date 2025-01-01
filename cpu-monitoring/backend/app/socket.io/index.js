const getCpuUsageHistory = require("../utils/cpu");

const handleIo = io => {
    monitorCpuUsage(io);
    io.on("connection", socket => {
        monitorCpuUsage(socket);
    });
};

const monitorCpuUsage = socket => {
    setInterval(() => {
        const cpuUsage = getCpuUsageHistory();
        socket.emit("cpu-usage", cpuUsage);

    }, 1000);
};

module.exports = handleIo;