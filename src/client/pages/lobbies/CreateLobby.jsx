import React from "react";
import FlexBox from "components/flexbox/FlexBox";
import { setLobby, setLobbiesResponse } from "actions/store";
import { LOBBY } from "../../../config/actions/lobby";
import { LOBBIES } from "../../../config/actions/lobbies";
import { socket } from "store/middleware";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./Lobbies.scss";

export default function CreateLobby({ close, state, dispatch }) {
  const { t } = useTranslation();
  const [myLobby, setMyLobby] = React.useState({
    maxPlayer: 4,
    owner: state.player,
  });
  const notify = (error) => toast.error(error);

  const handleLobby = (e) => {
    const value = e.target.value;
    const property = e.target.name;
    setMyLobby((myLobby) => ({
      ...myLobby,
      [property]: value,
    }));
  };
  const minPlayers = 2;
  const playersInputRange = 4;
  const playersSelection = new Array(playersInputRange).fill(0);

  React.useEffect(() => {
    if (state.lobbiesResponse.action === LOBBIES.ADD) {
      if (state.lobbiesResponse.type === "error") {
        notify(state?.lobbiesResponse?.reason);
      } else if (state.lobbiesResponse.type === "success") {
        dispatch(setLobby(state.lobbiesResponse.payload));
        dispatch(setLobbiesResponse({}));
        socket.emit(LOBBY.SUBSCRIBE, {
          playerId: state.player.id,
          lobbyId: state.lobbiesResponse.payload.id,
        });
        close();
      }
    }
  }, [state.lobbiesResponse]);

  const createLobby = () => {
    if (
      myLobby &&
      myLobby?.maxPlayer &&
      myLobby.maxPlayer >= 2 &&
      myLobby.maxPlayer <= 5 &&
      myLobby.owner &&
      myLobby?.name &&
      myLobby.name.length > 0 &&
      myLobby.name.trim() !== ""
    ) {
      socket.emit(LOBBIES.ADD, myLobby);
    } else {
      notify("Invalid lobby creation!");
    }
    setMyLobby({
      maxPlayer: 4,
      owner: state.player,
    });
  };

  const submit = (event) => {
    event.preventDefault();
    createLobby();
  };

  const isDisabled = !myLobby?.name?.length || !myLobby?.maxPlayer;

  return (
    <div>
      <h1 className="text-center">{t("pages.lobbies.create_lobby")}</h1>
      <FlexBox direction="row" className="">
        <FlexBox direction="col" className="items-center border-red-400 py-2">
          <form onSubmit={submit}>
            <input
              className="create-input"
              name="name"
              placeholder={t("pages.lobbies.lobby_name")}
              value={myLobby?.name || ""}
              onChange={handleLobby}
              autoFocus
            />
            <span className="mt-1">{t("pages.lobbies.max_players")}:</span>
            <select
              className="create-input"
              onChange={handleLobby}
              name="maxPlayer"
              defaultValue={4}
            >
              {playersSelection.map((_value, input) => {
                const inputValue = input + minPlayers;
                return (
                  <option
                    value={inputValue}
                    key={input + "select players number"}
                  >
                    {inputValue}
                  </option>
                );
              })}
            </select>
            <button
              data-testid="create_new_lobby"
              className={`${
                isDisabled ? "disabled-btn text-white" : "action-btn text-white"
              } `}
              disabled={isDisabled}
              type="submit"
            >
              {t("pages.lobbies.create_lobby")}
            </button>
          </form>
        </FlexBox>
      </FlexBox>
    </div>
  );
}
