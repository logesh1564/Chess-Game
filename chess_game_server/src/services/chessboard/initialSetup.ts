import { GRID_COLORS, MAIN_COINS_INITIAL_ORDER, COINS } from "../constant";
import { GridDataType } from "../types";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";

const pieceBluePrint = [
  Rook,
  Knight,
  Bishop,
  Queen,
  King,
  Bishop,
  Knight,
  Rook,
];

export const getInitialBoardSetup = function (): Array<GridDataType[]> {
  const board: Array<GridDataType[]> = [];
  for (let row = 0; row < 8; row++) {
    const temp: GridDataType[] = [];
    let currentGridColor =
      row % 2 !== 0 ? GRID_COLORS.WHITE : GRID_COLORS.BLACK;
    for (let col = 0; col < 8; col++) {
      if (row === 0) {
        temp[col] = {
          piece: new pieceBluePrint[col](
            row,
            col,
            MAIN_COINS_INITIAL_ORDER.white[col] as COINS,
            GRID_COLORS.WHITE
          ),
          color: currentGridColor,
        };
      } else if (row === 1) {
        temp[col] = {
          piece: new Pawn(row, col, COINS.WHITE_PAWN, GRID_COLORS.WHITE),
          color: currentGridColor,
        };
      } else if (row === 7) {
        temp[col] = {
          piece: new pieceBluePrint[col](
            row,
            col,
            MAIN_COINS_INITIAL_ORDER.black[col] as COINS,
            GRID_COLORS.BLACK
          ),
          color: currentGridColor,
        };
      } else if (row === 6) {
        temp[col] = {
          piece: new Pawn(row, col, COINS.BLACK_PAWN, GRID_COLORS.BLACK),
          color: currentGridColor,
        };
      } else {
        temp[col] = {
          color: currentGridColor,
        };
      }
      currentGridColor =
        currentGridColor === GRID_COLORS.WHITE
          ? GRID_COLORS.BLACK
          : GRID_COLORS.WHITE;
    }
    board.push(temp);
  }
  return board;
};
