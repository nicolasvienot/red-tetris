import Player from "models/player";
import Response from "models/response";
import { logerror, loginfo } from "utils/log";
import { pushPlayer, popPlayer } from "store/players";
import { getComplexObjectFromRedis } from "store";
import { PLAYER } from "./../../../config/actions/player";

export const handlerCreatePlayer = async (socket, { name }) => {
  const socketId = socket.id;
  const player = new Player({ name, socketId });
  const res = await pushPlayer(player);

  switch (res) {
    case 0:
      {
        const response = Response.success(PLAYER.CREATE, player);
        loginfo("Player", response.payload.name, "created!");
        socket.emit(PLAYER.RESPONSE, { response });

        /* Sending all players */
        const players = await getComplexObjectFromRedis("players");
        socket.broadcast.emit("players:publish", { players });
        socket.emit("players:publish", { players });
      }
      break;
    case 1:
      {
        const response = Response.error(
          PLAYER.CREATE,
          "playerName already exists!",
          {},
        );
        loginfo("playerName already exists!", name);
        socket.emit(PLAYER.RESPONSE, { response });
      }
      break;
    default: {
      const response = Response.error(PLAYER.CREATE, "There was an error!", {});
      loginfo("Error creating player", name);
      socket.emit(PLAYER.RESPONSE, { response });
    }
  }
};

export const handlerDeletePlayer = async (socket, { socketId }) => {
  await popPlayer(socketId);
  loginfo("Player with socketId", socketId, "deleted!");

  /* Sending all players */
  const players = await getComplexObjectFromRedis("players");
  socket.broadcast.emit("players:publish", { players });
  socket.emit("players:publish", { players });
};
