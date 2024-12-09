import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ChessBoard } from "../../components/board";
import RenderWhen from "../../HOC/RenderWhen";

import { GAME_RESULT_TYPE, SocketServiceInstance } from "../../service/socket";

import { GridDataType } from "../../types";
import { GRID_COLORS } from "../../constant";

import styles from "./chessRoom.module.css";
// import { MessageBar } from "../../components/messageBar";

export function ChessRoom() {
  const { roomId } = useParams();
  const [isConnecting, setIsConnecting] = useState(false);

  const [board, setBoard] = useState<GridDataType[][]>([]);
  const [turn, setTurn] = useState<GRID_COLORS>(GRID_COLORS.WHITE);
  const [currentPiece, setCurrentPieceHandling] = useState<GRID_COLORS>(
    GRID_COLORS.WHITE
  );
  const [gameEndDetails, setGameEndDetails] = useState<GAME_RESULT_TYPE>(null);

  useEffect(() => {
    setIsConnecting(true);

    SocketServiceInstance.onConnect(() => {});

    SocketServiceInstance.getInitialSetup((data) => {
      setBoard(data.board);
      setCurrentPieceHandling(data.pieceHandling);
      setTurn(data.turn);
    });
    SocketServiceInstance.getUpdatedDetails((data, callback) => {
      console.log("get_updated_details", data);
      setBoard(data.board);
      setTurn(data.turn);
      setGameEndDetails(data.result ? data.result : null);
      callback && callback("received");
    });

    SocketServiceInstance.joinToGame(roomId || "");
    setIsConnecting(false);
    return () => {
      //  Needs to disconnect logic
      // SocketServiceInstance.
    };
  }, [roomId]);

  return (
    <main className={styles.appContainer}>
      <RenderWhen.If isTrue={!isConnecting}>
        {roomId ? (
          <section className={styles.appBoardCard}>
            <ChessBoard
              board={board}
              setBoard={setBoard}
              turn={turn}
              setTurn={setTurn}
              gameEndDetails={gameEndDetails}
              setGameEndDetails={setGameEndDetails}
              roomId={roomId}
              currentPiece={currentPiece}
            />
            {/* <MessageBar /> */}
          </section>
        ) : (
          <div>Invaild Room Id</div>
        )}
      </RenderWhen.If>
      <RenderWhen.If isTrue={isConnecting}>
        <>loading....</>
      </RenderWhen.If>
    </main>
  );
}
