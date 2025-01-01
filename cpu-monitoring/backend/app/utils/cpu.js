const os = require("os-utils");

const maxHistoryLength = 14;
const cpuUsageHistory = Array(maxHistoryLength).fill(0).map((_, index) => ({
    index,
    usage: 0
}));

const getCpuUsageHistory = () => {
    os.cpuUsage(usage => {
        (cpuUsageHistory.length === maxHistoryLength) && cpuUsageHistory.shift();
        const cpuUsage = Number((usage * 100).toFixed(2));

        cpuUsageHistory.forEach((data, index) => {
            data.index = index;
        });

        const cpuUsageNewData = {
            index: maxHistoryLength - 1,
            usage: cpuUsage
        };

        cpuUsageHistory.push(cpuUsageNewData);
    });

    return cpuUsageHistory;
};

module.exports = getCpuUsageHistory;