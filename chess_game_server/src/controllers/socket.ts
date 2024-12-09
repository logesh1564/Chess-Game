import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "..";
import { Socket } from "socket.io";

const MAX_RETRIES = 30;

export const updateGameDetailsController = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  roomId: string,
  details: any,
  callback: (ack: string) => void,
  chessRooms: Record<string, any>
) => {
  const payload = {
    board: details.board,
    turn: details.turn,
    result: details.result,
    players: chessRooms?.[roomId]?.players,
  };

  // Determine target player IDs based on socket id
  const targetPlayerId =
    chessRooms?.[roomId]?.players.playerOne === socket.id
      ? chessRooms?.[roomId]?.players.playerTwo
      : chessRooms?.[roomId]?.players.playerOne;

  // Track acknowledgment from both players
  let acknowledgments = {
    playerOneAck: false,
    playerTwoAck: false,
  };

  chessRooms[roomId] = {
    ...chessRooms[roomId],
    board: details.board,
    turn: details.turn,
    result: details.result,
  };

  // Function to handle retry logic
  const attemptSend = (attempt = 1) => {
    // Send message to both players
    io.to(targetPlayerId).emit(
      "get_updated_details",
      payload,
      (ack: string) => {
        if (ack === "received") {
          let currentAck = false;
          // Mark acknowledgment for the specific player
          if (socket.id === chessRooms?.[roomId]?.players.playerOne) {
            // acknowledgments.playerOneAck = true;
            currentAck = true;
          } else if (socket.id === chessRooms?.[roomId]?.players.playerTwo) {
            // acknowledgments.playerTwoAck = true;
            currentAck = true;
          }

          // Check if both players have acknowledged
          if (currentAck) {
            console.log("Both players received the update successfully.");
            callback("success");
            return; // Both players have acknowledged
          }

          // If either hasn't acknowledged, retry for the remaining player
          if (attempt < MAX_RETRIES) {
            console.log(`Retrying delivery... Attempt ${attempt + 1}`);
            setTimeout(() => attemptSend(attempt + 1), 1000); // Retry after 1 second
          } else {
            console.error("Failed to deliver update after retries.");
            callback("failed");
          }
        } else {
          // Failed acknowledgment case, handle retries
          if (attempt < MAX_RETRIES) {
            console.log(`Retrying delivery... Attempt ${attempt + 1}`);
            setTimeout(() => attemptSend(attempt + 1), 1000); // Retry after 1 second
          } else {
            console.error("Failed to deliver update after retries.");
            callback("failed");
          }
        }
      }
    );
  };

  // Start the sending attempt
  attemptSend();
};
