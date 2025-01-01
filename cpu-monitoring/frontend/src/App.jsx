import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { io } from "socket.io-client";
import "./app.css"

function App() {
  const [cpuUsageHistory, setCpuUsageHistory] = useState(false);

  useEffect(() => {
    const socketIo = io("http://localhost:3000");
    socketIo.on("cpu-usage", cpuUsageHistory => setCpuUsageHistory(cpuUsageHistory));
  }, []);

  if (!cpuUsageHistory) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>CPU Usage (%)</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={cpuUsageHistory}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis type="number" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Label value="CPU Usage History" position="top" />
            <Area type="monotone" dataKey="usage" stroke="#000" fill="#000" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App;
