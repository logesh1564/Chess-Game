import React, { useState } from "react";
import { createPortal } from "react-dom";
import { GAME_ENDED_REASON, GRID_COLORS } from "../../constant";
import "./modal.css";
import { GAME_RESULT_TYPE } from "../../service/socket";

interface ResultModalProps {
  visibility: boolean;
  details: GAME_RESULT_TYPE;
}
export const ResultModal = ({ visibility, details }: ResultModalProps) => {
  const rootId = document.getElementById("root");
  const [visibleModal, setVisibleModal] = useState(true);
  React.useEffect(() => {
    setVisibleModal(visibility);
  }, [visibility]);
  return (
    <div>
      {rootId &&
        visibleModal &&
        createPortal(
          <div className="modal-chess-container">
            <div className="modal-chess-sub-container">
              <center className="modal-header">
                {details?.details?.winner?.toLocaleUpperCase()}{" "}
                {details?.type === GAME_ENDED_REASON.CHECKMATE
                  ? " WINS"
                  : " DRAW"}
              </center>
              <center className="modal-description">
                {`${details?.type?.toUpperCase()} -   ${(details?.details
                  ?.winner === GRID_COLORS.WHITE
                  ? GRID_COLORS.BLACK
                  : GRID_COLORS.WHITE
                )?.toLocaleUpperCase()} CAN'T MOVE`}
              </center>
              <center>
                <button>RESTART</button>
              </center>
            </div>
          </div>,
          rootId
        )}
    </div>
  );
};
