import { getComplexObjectFromRedis, setComplexObjectToRedis } from "storage";
import Response from "models/response";
import { PLAYER } from "../../config/actions/player";

export const getPlayers = async () =>
  (await getComplexObjectFromRedis("players")) ?? {};

export const getPlayer = async (id) => {
  const players = (await getComplexObjectFromRedis("players")) ?? {};
  const player = players?.[id];
  if (!player) {
    return null;
  }
  return player;
};

export const getPlayerId = async (socketId) => {
  const players = (await getComplexObjectFromRedis("players")) ?? {};
  const playerId = Object.keys(players || {}).find(
    (key) => players[key].socketId === socketId,
  );
  if (!playerId) {
    return null;
  }
  return playerId;
};

export const pushPlayer = async (player) => {
  const players = (await getComplexObjectFromRedis("players")) ?? {};

  if (!player?.name || !isValid(player?.name)) {
    return Response.error(PLAYER.CREATE, "Invalid username!");
  }

  const available = isAvailable(players, player.name);
  if (!available) {
    return Response.error(PLAYER.CREATE, "Username already exists!");
  }

  players[player.id] = player;
  await setComplexObjectToRedis("players", players);
  return Response.success(PLAYER.CREATE, player);
};

export const popPlayer = async (id) => {
  const players = (await getComplexObjectFromRedis("players")) ?? {};
  if (!players?.[id]) {
    return false;
  }
  Reflect.deleteProperty(players, id);
  await setComplexObjectToRedis("players", players);
  return true;
};

const isAvailable = (players, username) =>
  !Object.keys(players || {}).some((key) => players[key].name === username);

const isValid = (username) => RegExp("^[a-zA-Z0-9_-]{3,16}$").test(username);
