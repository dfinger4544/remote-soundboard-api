import { Server } from "socket.io";

let io: any;

export default {
  init: (httpServer: any) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    return io;
  },
  getIo: () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
  },
};
