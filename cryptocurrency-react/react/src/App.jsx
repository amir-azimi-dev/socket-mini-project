import "./App.css";
import Coins from "./components/Coins/Coins";
import { io } from "socket.io-client";

const socketIo = io("http://localhost:3000");

function App() {
  return <Coins io={socketIo} />;
}

export default App;
