import React, { createContext, useEffect, useState } from "react";
import { ChessBoard } from "./components/board";

import { GAME_RESULT_TYPE, SocketServiceInstance } from "./service/socket";
import { GridDataType } from "./types";
import { GRID_COLORS } from "./constant";
import styles from "./app.module.css";
import { RoomLogin } from "./pages/roomLogin";

interface GameContextType {
  board: GridDataType[][];
  setBoard: React.Dispatch<React.SetStateAction<GridDataType[][]>>;
  turn: GRID_COLORS;
  setTurn: React.Dispatch<React.SetStateAction<GRID_COLORS>>;
  gameEndDetails: GAME_RESULT_TYPE;
  setGameEndDetails: React.Dispatch<React.SetStateAction<GAME_RESULT_TYPE>>;
  roomId: string;
  currentPiece: GRID_COLORS;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextType>({
  board: [],
  setBoard: () => {},
  turn: GRID_COLORS.WHITE,
  setTurn: () => {},
  gameEndDetails: null,
  setGameEndDetails: () => {},
  roomId: "",
  currentPiece: GRID_COLORS.WHITE,
  setRoomId: () => {},
});

export const App = (): JSX.Element => {
  const [roomId, setRoomId] = useState<string>("");
  const [board, setBoard] = useState<GridDataType[][]>([]);
  const [turn, setTurn] = useState<GRID_COLORS>(GRID_COLORS.WHITE);
  const [currentPiece, setCurrentPieceHandling] = useState<GRID_COLORS>(
    GRID_COLORS.WHITE
  );
  const [gameEndDetails, setGameEndDetails] = useState<GAME_RESULT_TYPE>(null);

  useEffect(() => {
    SocketServiceInstance.onConnect();
    // SocketServiceInstance.joinToGame(roomId);
    SocketServiceInstance.getInitialSetup((data) => {
      setBoard(data.board);
      setCurrentPieceHandling(data.pieceHandling);
      setTurn(data.turn);
    });
    SocketServiceInstance.getUpdatedDetails((data) => {
      console.log("get_updated_details", data);
      setBoard(data.board);
      setTurn(data.turn);
      setGameEndDetails(data.result ? data.result : null);
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        board,
        setBoard,
        turn,
        setTurn,
        gameEndDetails,
        setGameEndDetails,
        roomId,
        currentPiece,
        setRoomId,
      }}
    >
      <main className={styles.appContainer}>
        {roomId ? (
          <section className={styles.appBoardCard}>
            <ChessBoard />
          </section>
        ) : (
          <RoomLogin />
        )}
      </main>
    </GameContext.Provider>
  );
};
