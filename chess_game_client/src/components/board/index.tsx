import { useState } from "react";
import RenderWhen from "../../HOC/RenderWhen";
import cloneDeep from "lodash.clonedeep";
import { ResultModal } from "../modals";

import {
  COINS,
  COIN_IMAGES,
  GAME_ENDED_REASON,
  GRID_COLORS,
} from "../../constant";
import { classNames } from "../../utils/common";

import { GridDataType, PieceType, PositionType } from "../../types";
import {
  changePosition,
  getCastlingChances,
  getEnpassantRuleChances,
  getValidMoves,
  isCheck,
  updateFirstMove,
  updateValidMoves,
} from "../../utils/validations";
// import { GameContext } from "../../App";
import { GAME_RESULT_TYPE, SocketServiceInstance } from "../../service/socket";

import styles from "./chessBoard.module.css";

// import { PromotionModal } from "../promotionModal";

interface ChessBoardProps {
  board: GridDataType[][];
  setBoard: React.Dispatch<React.SetStateAction<GridDataType[][]>>;
  turn: GRID_COLORS;
  setTurn: React.Dispatch<React.SetStateAction<GRID_COLORS>>;
  gameEndDetails: GAME_RESULT_TYPE;
  setGameEndDetails: React.Dispatch<React.SetStateAction<GAME_RESULT_TYPE>>;
  roomId: string;
  currentPiece: GRID_COLORS;
}

export const ChessBoard = ({
  board,
  setBoard,
  setTurn,
  turn,
  gameEndDetails,
  setGameEndDetails,
  roomId,
  currentPiece,
}: ChessBoardProps): JSX.Element => {
  const [selectedCoin, setSelectedCoin] = useState<PieceType | null>(null);
  const [lastMove, setLastMove] = useState<{
    source: PositionType;
    target: PositionType;
  } | null>(null);

  const simulateMove = (
    board: GridDataType[][],
    selectedCoin: PieceType,
    currentPosition: PositionType
  ): GridDataType[][] | null => {
    if (selectedCoin && currentPosition) {
      const { row: prevRow, col: prevCol } = selectedCoin;
      const { row: curRow, col: curCol } = currentPosition;

      const tempBoard = cloneDeep(board);
      tempBoard[curRow][curCol].piece = tempBoard[prevRow][prevCol].piece;
      tempBoard[prevRow][prevCol].piece = undefined;
      if (tempBoard[curRow][curCol]?.piece) {
        changePosition(
          tempBoard[curRow][curCol].piece as PieceType,
          curRow,
          curCol
        );

        updateFirstMove(tempBoard[curRow][curCol]?.piece as PieceType);
      }

      // Only for castling update
      if (selectedCoin?.king) {
        const castlingChances = getCastlingChances(board, selectedCoin, turn);
        if (
          castlingChances.some(
            (move) =>
              move.row === currentPosition.row &&
              move.col === currentPosition.col
          )
        ) {
          if (curCol === prevCol + 2) {
            const kingSideRook = tempBoard[curRow][curCol + 1].piece;
            tempBoard[curRow][curCol - 1].piece = kingSideRook;
            tempBoard[curRow][curCol + 1].piece = undefined;
            kingSideRook && changePosition(kingSideRook, curRow, curCol - 1);
          }
          // Queen side castle
          else if (curCol === prevCol - 2) {
            const queenSideRook = tempBoard[curRow][curCol - 2].piece;
            tempBoard[curRow][curCol + 1].piece = queenSideRook;
            tempBoard[curRow][curCol - 2].piece = undefined;
            queenSideRook && changePosition(queenSideRook, curRow, curCol + 1);
          }
        }
      }

      // Only for enpassant update
      if (selectedCoin?.pawn && lastMove) {
        const enpassantChances = getEnpassantRuleChances(
          board,
          selectedCoin,
          lastMove
        );
        const isEnpassed = enpassantChances?.some(
          (move) => move.row === curRow && move.col === curCol
        );
        if (isEnpassed) {
          if (turn === GRID_COLORS.WHITE)
            tempBoard[curRow - 1][curCol].piece = undefined;
          else tempBoard[curRow + 1][curCol].piece = undefined;
        }
      }
      return tempBoard;
    }
    return null;
  };

  const updateSeletedPiecesMoves = (selectedPiece: PieceType) => {
    const selectPiece = cloneDeep(selectedPiece);
    // selectPiece
    updateValidMoves(board, selectPiece);
    if (selectPiece?.king && selectPiece.first) {
      const castlingMoves = getCastlingChances(board, selectPiece, turn);
      if (castlingMoves?.length > 0)
        selectPiece.movesList = [...selectPiece.movesList, ...castlingMoves];
    }
    if (selectPiece?.pawn && lastMove) {
      const enPassantMoves = getEnpassantRuleChances(
        board,
        selectPiece,
        lastMove
      );
      if (enPassantMoves?.length > 0)
        selectPiece.movesList = [...selectPiece.movesList, ...enPassantMoves];
    }
    return selectPiece;
  };

  const isCheckMate = (grid: GridDataType[][], turn: GRID_COLORS) => {
    if (!isCheck(grid, turn)) return false;
    const board = cloneDeep(grid);
    // scan the entire board find -> saferMove
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col];
        if (square.piece && square.piece.color === turn) {
          const getAllPossibleMoves = getValidMoves(board, square.piece);
          for (const selectPos of getAllPossibleMoves) {
            const selectedPiece = square.piece;
            // update all possible moves in move_list
            const updatedSelectedPiece =
              updateSeletedPiecesMoves(selectedPiece);
            const afterMove = simulateMove(
              board,
              updatedSelectedPiece,
              selectPos
            );
            if (afterMove && !isCheck(afterMove, turn)) return false;
          }
        }
      }
    }
    return true;
  };
  const isStaleMate = (grid: GridDataType[][], turn: GRID_COLORS) => {
    if (isCheck(grid, turn)) return false;
    const board = cloneDeep(grid);
    if (isCheck(board, turn)) return false; // If in check, not stalemate
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = board[row][col];
        if (square.piece && square.piece.color === turn) {
          const getAllPossibleMoves = getValidMoves(board, square.piece);
          for (const selectPos of getAllPossibleMoves) {
            const selectedPiece = square.piece;
            const updatedSelectedPiece =
              updateSeletedPiecesMoves(selectedPiece);
            const afterMove = simulateMove(
              board,
              updatedSelectedPiece,
              selectPos
            );
            if (afterMove && !isCheck(afterMove, turn)) {
              return false; // Found a valid move, not stalemate
            }
          }
        }
      }
    }
    return true; // No valid moves found, stalemate
  };

  console.log({ gameEndDetails });

  const move = (currentPosition: PositionType) => {
    // I) change to player move and check if there no check then update in board
    if (selectedCoin && currentPosition) {
      const tempBoard = simulateMove(board, selectedCoin, currentPosition);
      const invertedTurn =
        turn === GRID_COLORS.WHITE ? GRID_COLORS.BLACK : GRID_COLORS.WHITE;

      if (tempBoard && !isCheck(tempBoard, turn)) {
        setBoard(tempBoard);

        const checkingForCheckMate = isCheckMate(tempBoard, invertedTurn);
        const checkingForStaleMate = isStaleMate(tempBoard, invertedTurn);
        let gameStatus: {
          type: GAME_ENDED_REASON;
          details?: { winner: GRID_COLORS };
        } | null = null;
        if (checkingForStaleMate) {
          gameStatus = {
            type: GAME_ENDED_REASON.STALEMATE,
          };
          setGameEndDetails(gameStatus);
        }
        if (checkingForCheckMate) {
          gameStatus = {
            type: GAME_ENDED_REASON.CHECKMATE,
            details: { winner: turn },
          };
          setGameEndDetails(gameStatus);
        }
        setTurn(invertedTurn);
        setLastMove({
          source: {
            row: selectedCoin.row,
            col: selectedCoin.col,
          },
          target: currentPosition,
        });

        // update the socket
        SocketServiceInstance.updatedetails(roomId, {
          board: tempBoard,
          turn: invertedTurn,
          result: gameStatus,
        });
      }
      setSelectedCoin(null);
    }
  };

  const coinClickHandler = (row: number, col: number) => {
    if (currentPiece !== turn) return;
    const square = board[row][col];
    // no coin + current turn -> allow to selection
    // already made selection ->
    //                         i) if correct place allow to move
    if (!selectedCoin && square?.piece?.color === turn) {
      const selectPiece = updateSeletedPiecesMoves(square?.piece);
      setSelectedCoin(selectPiece);
    } else {
      // valid move -> allow to move
      if (selectedCoin && board[row][col]?.piece?.color !== turn) {
        //  piece valid square
        if (
          selectedCoin.movesList.some(
            (data) => data.col === col && data.row === row
          )
        )
          move({ row, col });
      } else setSelectedCoin(null);
    }
  };

  const boardReverse = (chessBoard: JSX.Element[][]): JSX.Element[][] => {
    switch (currentPiece) {
      case GRID_COLORS.WHITE:
        return chessBoard.reverse();
      case GRID_COLORS.BLACK:
        return chessBoard;
    }
  };
  return (
    <main className={styles.chessBoard}>
      {boardReverse(
        board?.map((rowData, rowIndex: number) => {
          return rowData?.map((cellData, colIndex) => {
            return (
              <section
                key={`${rowIndex} ${colIndex}`}
                className={classNames({
                  [styles.whiteGrid]: cellData.color === GRID_COLORS.WHITE,
                  [styles.greenGrid]: cellData.color === GRID_COLORS.BLACK,
                  [styles.selectedPieceGrid]:
                    Boolean(selectedCoin) &&
                    cellData?.piece?.row === selectedCoin?.row &&
                    cellData?.piece?.col === selectedCoin?.col,
                })}
                onClick={() => coinClickHandler(rowIndex, colIndex)}
              >
                <RenderWhen.If isTrue={Boolean(cellData?.piece?.coin)}>
                  <img
                    src={COIN_IMAGES[cellData?.piece?.coin as COINS]}
                    alt={cellData?.piece?.coin}
                    style={{ width: "100%", height: "100%" }}
                    className={styles.coinAnimate}
                  />
                </RenderWhen.If>
                <div
                  className={classNames({
                    [styles.hidden]: Boolean(
                      !selectedCoin?.movesList?.some(
                        (data) => data.row === rowIndex && data.col === colIndex
                      )
                    ),
                    [styles.highLighting]: Boolean(
                      selectedCoin?.movesList?.some(
                        (data) => data.row === rowIndex && data.col === colIndex
                      )
                    ),
                  })}
                />
                {/* <RenderWhen.If
                  isTrue={
                    selectedCoin?.row === rowIndex &&
                    selectedCoin?.col === colIndex
                  }
                >
                  <PromotionModal />
                </RenderWhen.If> */}
              </section>
            );
          });
        })
      )}

      <ResultModal
        details={gameEndDetails}
        visibility={Boolean(gameEndDetails?.type)}
      />
    </main>
  );
};
