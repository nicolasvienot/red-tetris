import { createEvent, bindEvent } from "helpers/socket";
import * as piece from "socket/piece";
import { logerror, loginfo } from "utils/log";
import socketIO from "socket.io";

const handlers = Object.values({
  ...piece,
});

const runSocketIo = (httpServer) => {
  const io = socketIO(httpServer);

  io.on("connection", (socket) => {
    loginfo("A new user has connected!");
    handlers.forEach((handler) => {
      bindEvent(socket, handler);
    });
  });

  loginfo("Sockets have been initialized!");
  return { httpServer, io };
};

export default runSocketIo;
