import { COINS, GRID_COLORS } from "./constant";

export interface PositionType {
  row: number;
  col: number;
}

export interface PieceType {
  row: number;
  col: number;
  coin: COINS;
  color: GRID_COLORS;
  first: boolean;
  pawn: boolean;
  king: boolean;
  rook: boolean;
  movesList: PositionType[];
  // changePosition: (row: number, column: number) => void;
  // updateValidMoves: (board: GridDataType[][]) => void;
  // getValidMoves: (board: GridDataType[][]) => PositionType[];
  // updateFirstMove: (value: boolean) => void;
}
export interface GridDataType {
  color: GRID_COLORS;
  piece?: PieceType;
}
