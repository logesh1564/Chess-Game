import { COINS, GRID_COLORS } from "../constant";
import { GridDataType, PieceType, PositionType } from "../types";
import {
  getBishopValidMoves,
  getKingValidMoves,
  getKnightValidMoves,
  getPawnValidMoves,
  getQueenValidMoves,
  getRookValidMoves,
} from "./pieces";

export const getAllOppenentMoves = (
  board: GridDataType[][],
  turn: GRID_COLORS
) => {
  const oppenentMoves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col].piece && board[row][col].piece?.color !== turn) {
        for (const move of getValidMoves(
          board,
          board[row][col].piece as PieceType
        ) || [])
          oppenentMoves.push(move);
      }
    }
  }
  return oppenentMoves;
};

export const isCheck = (
  board: GridDataType[][],
  turn: GRID_COLORS
): boolean => {
  //  PROCESS
  // i) get all possible moves for oppsite color
  // ii) needs  to check if one of the move is intersect with current position

  let kingPos = { row: -1, col: -1 };

  // get king position
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (
        board[row][col]?.piece?.color === turn &&
        board[row][col]?.piece?.king
      ) {
        kingPos = { row, col };
        break;
      }
    }
  }
  return getAllOppenentMoves(board, turn).some(
    (oppMove) => oppMove.col === kingPos.col && kingPos.row === oppMove.row
  );
};

export const getCastlingChances = (
  board: GridDataType[][],
  selectedCoin: PieceType,
  turn: GRID_COLORS
): PositionType[] => {
  if (!selectedCoin?.first) return [];
  const oppentMoves = getAllOppenentMoves(board, turn);
  const moves = [];
  let kSideCastle = true,
    qSideCastle = true;
  // King side Castle
  const kingSidePiece = board[selectedCoin.row][selectedCoin.col + 3].piece;
  const queenSidePiece = board[selectedCoin.row][selectedCoin.col - 4].piece;
  if (
    kingSidePiece?.color === turn &&
    kingSidePiece?.rook &&
    kingSidePiece?.first
  ) {
    for (let col = selectedCoin?.col; col < 7; col++) {
      const piece = board[selectedCoin?.row][col]?.piece;
      if (
        oppentMoves.some(
          (move) => move.row === piece?.row && move.col === piece?.col
        )
      ) {
        kSideCastle = false;
        break;
      }
      if (col !== selectedCoin?.col && piece) {
        kSideCastle = false;
        break;
      }
    }
    if (kSideCastle)
      moves.push({
        row: selectedCoin.row,
        col: selectedCoin.col + 2,
      });
  }
  if (
    queenSidePiece?.color === turn &&
    queenSidePiece.rook &&
    queenSidePiece?.first
  ) {
    for (let col = selectedCoin?.col; col > 1; col--) {
      const piece = board[selectedCoin?.row][col]?.piece;
      if (
        oppentMoves.some(
          (move) => move.row === piece?.row && move.col === piece?.col
        )
      ) {
        qSideCastle = false;
        break;
      }
      if (col !== selectedCoin?.col && piece) {
        qSideCastle = false;
        break;
      }
    }
    if (qSideCastle)
      moves.push({
        row: selectedCoin.row,
        col: selectedCoin.col - 2,
      });
  }
  return moves;
};

export const getEnpassantRuleChances = (
  board: GridDataType[][],
  selectedCoin: PieceType,
  lastMove: {
    source: PositionType;
    target: PositionType;
  }
) => {
  const moves: PositionType[] = [];
  if (
    !selectedCoin?.pawn ||
    !lastMove ||
    board[lastMove?.target.row][lastMove?.target.col]?.piece?.color ===
      selectedCoin?.color ||
    !board[lastMove?.target.row][lastMove?.target.col]?.piece?.pawn ||
    Math.abs(lastMove.target.row - lastMove.source.row) !== 2
  )
    return [];
  const { row, col } = selectedCoin;

  switch (selectedCoin?.color) {
    case GRID_COLORS.WHITE:
      if (row === 4) {
        // LEFT
        if (col > 0 && lastMove.target.col === col - 1)
          moves.push({ row: row + 1, col: col - 1 });
        // Right
        if (col < 7 && lastMove.target.col === col + 1)
          moves.push({ row: row + 1, col: col + 1 });
      }
      break;
    case GRID_COLORS.BLACK:
      if (row === 3) {
        if (col > 0 && lastMove.target.col === col - 1)
          moves.push({ row: row - 1, col: col - 1 });
        if (col < 7 && lastMove.target.col === col + 1)
          moves.push({ row: row - 1, col: col + 1 });
      }
      break;
  }
  return moves;
};

export const getValidMoves = (board: GridDataType[][], piece: PieceType) => {
  switch (piece.coin) {
    case COINS.BLACK_ROOK:
    case COINS.WHITE_ROOK:
      return getRookValidMoves(board, piece);
    case COINS.BLACK_KNIGHT:
    case COINS.WHITE_KNIGHT:
      return getKnightValidMoves(board, piece);
    case COINS.BLACK_BISHOP:
    case COINS.WHITE_BISHOP:
      return getBishopValidMoves(board, piece);
    case COINS.BLACK_QUEEN:
    case COINS.WHITE_QUEEN:
      return getQueenValidMoves(board, piece);
    case COINS.BLACK_KING:
    case COINS.WHITE_KING:
      return getKingValidMoves(board, piece);
    case COINS.BLACK_PAWN:
    case COINS.WHITE_PAWN:
      return getPawnValidMoves(board, piece);
  }
};

export const updateValidMoves = (board: GridDataType[][], piece: PieceType) => {
  piece.movesList = getValidMoves(board, piece);
};

export const changePosition = (piece: PieceType, row: number, col: number) => {
  piece.row = row;
  piece.col = col;
};

export const updateFirstMove = (piece: PieceType) => {
  piece.first = false;
};
