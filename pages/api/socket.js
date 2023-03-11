import { Server } from "Socket.IO";
import { Alchemy, Network } from "alchemy-sdk";

export default function handler(req, res) {
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);

  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.socket.server.io.on("connection", (socket) => {
      alchemy.ws.on("block", async (blockNumber) => {
        const newBlock = await alchemy.core.getBlock(blockNumber);
        socket.broadcast.emit("new-block", newBlock);
      });
    });
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  alchemy.ws.removeAllListeners("block");
  res.end();
}
