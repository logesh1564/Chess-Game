/* eslint-disable @typescript-eslint/no-explicit-any */
import { io } from "socket.io-client";
import { GridDataType } from "../../types";
import { GAME_ENDED_REASON, GRID_COLORS } from "../../constant";

const SERVER = "http://localhost:1564/";

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
  socket: any = null;
  constructor(socket: any) {
    this.socket = socket;
  }
  onConnect() {
    if (this.socket) {
      this.socket.on("connect", () => {
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

  getUpdatedDetails(callBack: (data: GAME_SERVER_RESPONSE) => void) {
    if (this.socket) {
      this.socket.on("get_updated_details", (data: GAME_SERVER_RESPONSE) => {
        console.log("working emit get_update_details");
        callBack(data);
      });
    }
  }
}

export const SocketServiceInstance = new SocketService(io(SERVER));
