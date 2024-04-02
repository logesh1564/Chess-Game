export enum GRID_COLORS {
  WHITE = "white",
  BLACK = "black",
}

export enum COINS {
  WHITE_PAWN = "WP",
  WHITE_KING = "WK",
  WHITE_QUEEN = "WQ",
  WHITE_ROOK = "WR",
  WHITE_BISHOP = "WB",
  WHITE_KNIGHT = "WKN",

  BLACK_PAWN = "BP",
  BLACK_KING = "BK",
  BLACK_QUEEN = "BQ",
  BLACK_ROOK = "BR",
  BLACK_BISHOP = "BB",
  BLACK_KNIGHT = "BKN",
}

export const COIN_IMAGES = {
  [COINS.WHITE_PAWN]: "https://assets-themes.chess.com/image/ejgfv/150/wp.png",
  [COINS.WHITE_KING]: "https://assets-themes.chess.com/image/ejgfv/150/wk.png",
  [COINS.WHITE_QUEEN]: "https://assets-themes.chess.com/image/ejgfv/150/wq.png",
  [COINS.WHITE_ROOK]: "https://assets-themes.chess.com/image/ejgfv/150/wr.png",
  [COINS.WHITE_BISHOP]:
    "https://assets-themes.chess.com/image/ejgfv/150/wb.png",
  [COINS.WHITE_KNIGHT]:
    "https://assets-themes.chess.com/image/ejgfv/150/wn.png",

  [COINS.BLACK_PAWN]: "https://assets-themes.chess.com/image/ejgfv/150/bp.png",
  [COINS.BLACK_KING]: "https://assets-themes.chess.com/image/ejgfv/150/bk.png",
  [COINS.BLACK_QUEEN]: "https://assets-themes.chess.com/image/ejgfv/150/bq.png",
  [COINS.BLACK_ROOK]: "https://assets-themes.chess.com/image/ejgfv/150/br.png",
  [COINS.BLACK_BISHOP]:
    "https://assets-themes.chess.com/image/ejgfv/150/bb.png",
  [COINS.BLACK_KNIGHT]:
    "https://assets-themes.chess.com/image/ejgfv/150/bn.png", // Fixed typo here
};

export const MAIN_COINS_INITIAL_ORDER = {
  white: [
    COINS.WHITE_ROOK,
    COINS.WHITE_KNIGHT,
    COINS.WHITE_BISHOP,
    COINS.WHITE_QUEEN,
    COINS.WHITE_KING,
    COINS.WHITE_BISHOP,
    COINS.WHITE_KNIGHT,
    COINS.WHITE_ROOK,
  ],
  black: [
    COINS.BLACK_ROOK,
    COINS.BLACK_KNIGHT,
    COINS.BLACK_BISHOP,
    COINS.BLACK_QUEEN,
    COINS.BLACK_KING,
    COINS.BLACK_BISHOP,
    COINS.BLACK_KNIGHT,
    COINS.BLACK_ROOK,
  ],
};

export enum PLAYER_TURN {
  WHITE = "white",
  BLACK = "black",
}

export enum GAME_ENDED_REASON {
  CHECKMATE = "checkmate",
  RESIGN = "resign",
  BY_TIMEOUT = "by_timeout",

  STALEMATE = "stalemate",
  INSUFFICENT_MATERAILS = "insufficient_materials",
  THREEFOLD_REPETITION = "threefold_repetition",
  BYAGREEMENT = "by_agreement",
}
