/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { GridDataType } from "../../types";
import { GAME_ENDED_REASON, GRID_COLORS } from "../../constant";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export const SERVER_URI = "https://chess-game-0uwo.onrender.com";

export type GAME_RESULT_TYPE = {
  type?: GAME_ENDED_REASON;
  details?: {
    winner: GRID_COLORS;
  };
} | null;
export interface GAME_SERVER_RESPONSE {
  board: GridDataType[][];
  turn: GRID_COLORS;
  result?: GAME_RESULT_TYPE;
  pieceHandling?: GRID_COLORS;
}

class SocketService {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
  constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
    this.socket = socket;
  }
  onConnect(callBack: () => void) {
    if (this.socket) {
      this.socket.on("connect", () => {
        callBack();
        console.log("connected to server.....");
      });
    }
  }

  joinToGame(roomId: string) {
    console.log("joined the room");
    if (this.socket) this.socket.emit("join_game", roomId);
  }

  getInitialSetup(
    callBack: (
      data: GAME_SERVER_RESPONSE & { pieceHandling: GRID_COLORS }
    ) => void
  ) {
    if (this.socket)
      this.socket.on(
        "get_initial_setup",
        (details: GAME_SERVER_RESPONSE & { pieceHandling: GRID_COLORS }) => {
          console.log("initialSetup", details);
          callBack(details);
        }
      );
  }

  updatedetails(roomId: string, details: GAME_SERVER_RESPONSE) {
    if (this.socket) {
      this.socket.emit("update_details", roomId, details);
    }
  }

  getUpdatedDetails(
    callBack: (
      data: GAME_SERVER_RESPONSE,
      socketCallBack: (ack: string) => void
    ) => void
  ) {
    if (this.socket) {
      this.socket.on(
        "get_updated_details",
        (data: GAME_SERVER_RESPONSE, socketCallBack: (ack: string) => void) => {
          console.log("working emit get_update_details");
          callBack(data, socketCallBack);
        }
      );
    }
  }
}

export const SocketServiceInstance = new SocketService(
  io(SERVER_URI, {
    query: { token: window.localStorage.getItem("lc-dev-userId") || "" },
  })
);
