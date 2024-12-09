import { getInitialBoardSetup } from "../services/chessboard/initialSetup";
import { GRID_COLORS } from "../services/constant";

export const getInitialSetup = () => {
  return {
    board: getInitialBoardSetup(),
    turn: GRID_COLORS.WHITE,
    result: { winner: null, reason: null },
    players: {
      playerOne: null,
      playerTwo: null,
    },
  };
};
