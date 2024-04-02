import { COINS, GRID_COLORS } from "../constant";
import { GridDataType, PositionType } from "../types";

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
