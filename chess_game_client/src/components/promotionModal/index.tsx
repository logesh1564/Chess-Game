import React from "react";
import styles from "./promotionModal.module.css";
import { Bishop, Knight, Queen, Rook } from "../../utils/pieces";
import { COINS, COIN_IMAGES, GRID_COLORS } from "../../constant";

export const PROMOTION_PIECES = {
  white: [
    new Queen(-1, -1, COINS.WHITE_QUEEN, GRID_COLORS.WHITE),
    new Rook(-1, -1, COINS.WHITE_ROOK, GRID_COLORS.WHITE),
    new Bishop(-1, -1, COINS.WHITE_BISHOP, GRID_COLORS.WHITE),
    new Knight(-1, -1, COINS.WHITE_KNIGHT, GRID_COLORS.WHITE),
  ],
  black: [
    new Queen(-1, -1, COINS.BLACK_QUEEN, GRID_COLORS.BLACK),
    new Rook(-1, -1, COINS.BLACK_ROOK, GRID_COLORS.BLACK),
    new Bishop(-1, -1, COINS.BLACK_BISHOP, GRID_COLORS.BLACK),
    new Knight(-1, -1, COINS.BLACK_KNIGHT, GRID_COLORS.BLACK),
  ],
};

export const PromotionModal = (): JSX.Element => {
  return (
    <main className={styles.promotionModal}>
      <section>
        {PROMOTION_PIECES?.white?.map((cellData) => {
          return (
            <img
              src={COIN_IMAGES[cellData?.coin as COINS]}
              alt={cellData?.coin}
              style={{ width: "100%", height: "100%" }}
            />
          );
        })}
      </section>
    </main>
  );
};
