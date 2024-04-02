/* eslint-disable @typescript-eslint/no-unused-vars */
import { COINS, GRID_COLORS } from "../constant";
import { GridDataType, PieceType, PositionType } from "../types";

export class Piece {
  row: number;
  col: number;
  coin: COINS;
  first: boolean = true;
  pawn: boolean = false;
  king: boolean = false;
  rook: boolean = false;
  movesList: PositionType[] = [];
  color: GRID_COLORS;

  constructor(row: number, col: number, coin: COINS, color: GRID_COLORS) {
    this.row = row;
    this.col = col;
    this.coin = coin;
    this.movesList = [];
    this.color = color;
  }
}

export class Pawn extends Piece {
  constructor(row: number, col: number, coin: COINS, color: GRID_COLORS) {
    super(row, col, coin, color);
    this.pawn = true;
  }
}

export class Knight extends Piece {}

export class Rook extends Piece {
  constructor(row: number, col: number, coin: COINS, color: GRID_COLORS) {
    super(row, col, coin, color);
    this.rook = true;
  }
}

export class Queen extends Piece {}

export class Bishop extends Piece {}

export class King extends Piece {
  constructor(row: number, col: number, coin: COINS, color: GRID_COLORS) {
    super(row, col, coin, color);
    this.first = true;
    this.king = true;
  }
}

// TODO: case needs to handle
//  stalemate
//  checkmate
//  castling
//  enspasent rule
//  three fold draw

// <------------------------------------------------------ validmoves --------------------------------------------->

export const getRookValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const row = coinDetails.row;
  const col = coinDetails.col;
  const moves = [];
  // TOP
  for (let top = row + 1; top < 8; top++) {
    const currentCoin = board[top][col];
    if (!currentCoin?.piece) {
      moves.push({ row: top, col });
    } else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col });
      break;
    }
  }

  // BOTTOM
  for (let bottom = row - 1; bottom >= 0; bottom--) {
    const currentCoin = board[bottom][col];
    if (!currentCoin?.piece) moves.push({ row: bottom, col });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col });
      break;
    }
  }

  // LEFT
  for (let left = col - 1; left >= 0; left--) {
    const currentCoin = board[row][left];
    if (!currentCoin?.piece) moves.push({ row: row, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: row, col: left });
      break;
    }
  }

  // RIGHT
  for (let right = col + 1; right < 8; right++) {
    const currentCoin = board[row][right];
    if (!currentCoin?.piece) moves.push({ row: row, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: row, col: right });
      break;
    }
  }
  return moves;
};

export const getKnightValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const row = coinDetails.row;
  const col = coinDetails.col;
  const moves = [];
  // TOP RIGHT i) SMALL L ii) LONG L
  if (row < 7 && col < 6) {
    const currentCoin = board[row + 1][col + 2];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row + 1, col: col + 2 });
  }
  if (row < 6 && col < 7) {
    const currentCoin = board[row + 2][col + 1];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row + 2, col: col + 1 });
  }

  //  TOP LEFT i) SMALL ii) LONG L
  if (row < 7 && col > 1) {
    const currentCoin = board[row + 1][col - 2];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row + 1, col: col - 2 });
  }
  if (row < 6 && col > 0) {
    const currentCoin = board[row + 2][col - 1];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row + 2, col: col - 1 });
  }

  // BOTTOM RIGHT  i) SMALL ii) LONG L
  if (row > 0 && col < 6) {
    const currentCoin = board[row - 1][col + 2];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row - 1, col: col + 2 });
  }
  if (row > 1 && col < 7) {
    const currentCoin = board[row - 2][col + 1];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row - 2, col: col + 1 });
  }

  //  TOP LEFT i) SMALL ii) LONG L
  if (row > 0 && col > 1) {
    const currentCoin = board[row - 1][col - 2];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row - 1, col: col - 2 });
  }
  if (row > 1 && col > 0) {
    const currentCoin = board[row - 2][col - 1];
    if (currentCoin.piece?.color !== coinDetails.color)
      moves.push({ row: row - 2, col: col - 1 });
  }

  return moves;
};
export const getBishopValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const row = coinDetails.row;
  const col = coinDetails.col;
  const moves = [];

  // Right Diagonal Front movement

  for (
    let top = row + 1, right = col + 1;
    top < 8 && right < 8;
    top++, right++
  ) {
    const currentCoin = board[top][right];
    if (!currentCoin?.piece) moves.push({ row: top, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col: right });
      break;
    }
  }

  for (
    let bottom = row - 1, right = col + 1;
    bottom >= 0 && right < 8;
    bottom--, right++
  ) {
    const currentCoin = board[bottom][right];
    if (!currentCoin?.piece) moves.push({ row: bottom, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col: right });
      break;
    }
  }

  // Left Diagonal Back movement
  for (let top = row + 1, left = col - 1; top < 8 && left >= 0; top++, left--) {
    const currentCoin = board[top][left];
    if (!currentCoin?.piece) moves.push({ row: top, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col: left });
      break;
    }
  }

  for (
    let bottom = row - 1, left = col - 1;
    bottom >= 0 && left >= 0;
    bottom--, left--
  ) {
    const currentCoin = board[bottom][left];
    if (!currentCoin?.piece) moves.push({ row: bottom, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col: left });
      break;
    }
  }

  return moves;
};

export const getQueenValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const row = coinDetails.row;
  const col = coinDetails.col;
  const moves = [];

  // Rook + Bishop = queen

  // Rook
  // TOP
  for (let top = row + 1; top < 8; top++) {
    const currentCoin = board[top][col];
    if (!currentCoin?.piece) {
      moves.push({ row: top, col });
    } else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col });
      break;
    }
  }

  // BOTTOM
  for (let bottom = row - 1; bottom >= 0; bottom--) {
    const currentCoin = board[bottom][col];
    if (!currentCoin?.piece) moves.push({ row: bottom, col });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col });
      break;
    }
  }

  // LEFT
  for (let left = col - 1; left >= 0; left--) {
    const currentCoin = board[row][left];
    if (!currentCoin?.piece) moves.push({ row: row, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: row, col: left });
      break;
    }
  }

  // RIGHT
  for (let right = col + 1; right < 8; right++) {
    const currentCoin = board[row][right];
    if (!currentCoin?.piece) moves.push({ row: row, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: row, col: right });
      break;
    }
  }

  // Bishop
  for (
    let top = row + 1, right = col + 1;
    top < 8 && right < 8;
    top++, right++
  ) {
    const currentCoin = board[top][right];
    if (!currentCoin?.piece) moves.push({ row: top, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col: right });
      break;
    }
  }

  for (
    let bottom = row - 1, right = col + 1;
    bottom >= 0 && right < 8;
    bottom--, right++
  ) {
    const currentCoin = board[bottom][right];
    if (!currentCoin?.piece) moves.push({ row: bottom, col: right });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col: right });
      break;
    }
  }

  // Left Diagonal Back movement
  for (let top = row + 1, left = col - 1; top < 8 && left >= 0; top++, left--) {
    const currentCoin = board[top][left];
    if (!currentCoin?.piece) moves.push({ row: top, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: top, col: left });
      break;
    }
  }

  for (
    let bottom = row - 1, left = col - 1;
    bottom >= 0 && left >= 0;
    bottom--, left--
  ) {
    const currentCoin = board[bottom][left];
    if (!currentCoin?.piece) moves.push({ row: bottom, col: left });
    else {
      if (currentCoin?.piece?.color !== coinDetails.color)
        moves.push({ row: bottom, col: left });
      break;
    }
  }

  return moves;
};

export const getKingValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const row = coinDetails.row;
  const col = coinDetails.col;
  const moves = [];
  // top ->right
  if (row < 7 && col < 7) {
    const currentCoin = board[row + 1][col + 1];
    if (!currentCoin?.piece) moves.push({ row: row + 1, col: col + 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row + 1, col: col + 1 });
  }
  // top ->middle
  if (row < 7) {
    const currentCoin = board[row + 1][col];
    if (!currentCoin?.piece) moves.push({ row: row + 1, col: col });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row + 1, col: col });
  }

  // top -> left
  if (row < 7 && col > 0) {
    const currentCoin = board[row + 1][col - 1];
    if (!currentCoin?.piece) moves.push({ row: row + 1, col: col - 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row + 1, col: col - 1 });
  }

  // bottom ->right
  if (row > 0 && col < 7) {
    const currentCoin = board[row - 1][col + 1];
    if (!currentCoin?.piece) moves.push({ row: row - 1, col: col + 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row - 1, col: col + 1 });
  }
  // bottom ->middle
  if (row > 0) {
    const currentCoin = board[row - 1][col];
    if (!currentCoin?.piece) moves.push({ row: row - 1, col: col });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row - 1, col: col });
  }

  // bottom -> left
  if (row > 0 && col > 0) {
    const currentCoin = board[row - 1][col - 1];
    if (!currentCoin?.piece) moves.push({ row: row - 1, col: col - 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row - 1, col: col - 1 });
  }

  // middle - left
  if (col > 0) {
    const currentCoin = board[row][col - 1];
    if (!currentCoin?.piece) moves.push({ row: row, col: col - 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row, col: col - 1 });
  }

  // middle - right
  if (col < 7) {
    const currentCoin = board[row][col + 1];
    if (!currentCoin?.piece) moves.push({ row: row, col: col + 1 });
    else if (currentCoin?.piece?.color !== coinDetails.color)
      moves.push({ row: row, col: col + 1 });
  }

  return moves;
};

export const getPawnValidMoves = (
  board: GridDataType[][],
  coinDetails: PieceType
): PositionType[] => {
  const moves = [];
  const row = coinDetails.row,
    col = coinDetails.col;
  if (coinDetails.color === GRID_COLORS.WHITE) {
    // SINGLE front move
    if (row < 7) {
      const currentCoin = board[row + 1][col]?.piece;
      if (!currentCoin) moves.push({ row: row + 1, col });
    }
    // Diagnoal  LEFT Move
    if (row < 7 && col > 0) {
      const currentCoin = board[row + 1][col - 1]?.piece;
      if (currentCoin && currentCoin?.color !== coinDetails.color)
        moves.push({ row: row + 1, col: col - 1 });
    }

    // Diagnoal  RIGHT Move
    if (row < 7 && col < 7) {
      const currentCoin = board[row + 1][col + 1]?.piece;
      if (currentCoin && currentCoin?.color !== coinDetails.color)
        moves.push({ row: row + 1, col: col + 1 });
    }

    if (coinDetails.first && row < 6) {
      const currentCoin = board[row + 2][col];
      const beforeSpace = board[row + 1][col];

      if (!beforeSpace?.piece && !currentCoin.piece)
        moves.push({ row: row + 2, col });
    }
  } else {
    // SINGLE front move
    if (row > 0) {
      const currentCoin = board[row - 1][col]?.piece;
      if (!currentCoin) moves.push({ row: row - 1, col });
    }
    // Diagnoal  LEFT Move
    if (row > 0 && col > 0) {
      const currentCoin = board[row - 1][col - 1]?.piece;
      if (currentCoin && currentCoin?.color !== coinDetails.color)
        moves.push({ row: row - 1, col: col - 1 });
    }

    // Diagnoal  RIGHT Move
    if (row > 0 && col < 7) {
      const currentCoin = board[row - 1][col + 1]?.piece;
      if (currentCoin && currentCoin?.color !== coinDetails.color)
        moves.push({ row: row - 1, col: col + 1 });
    }

    if (coinDetails.first && row > 1) {
      const currentCoin = board[row - 2][col];
      const beforeSpace = board[row - 1][col];

      if (!beforeSpace?.piece && !currentCoin.piece)
        moves.push({ row: row - 2, col });
    }
  }

  return moves;
};
