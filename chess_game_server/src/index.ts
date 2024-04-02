import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getInitialBoardSetup } from "./services/chessboard/initialSetup";
import { GRID_COLORS } from "./services/constant";

const app = express();
const server = createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// i) join room.
// ii) send initial position with piece handling.
// iii) update move in the server
// iv) emit the updated values to the client

// Todo
// waiting for the oppnent.
// throw room full error.
// restart
// disconnect
// time

const chessRooms: Record<string, any> = {};
io.on("connection", (socket) => {
  // Join a Game Room
  socket.on("join_game", (roomId: string) => {
    socket.join(roomId);
    console.log("join", socket.id);
    if (!chessRooms?.[roomId]?.players?.playerTwo) {
      if (!chessRooms[roomId]) {
        chessRooms[roomId] = getInitialSetup();
        chessRooms[roomId].players.playerOne = socket.id;
      } else {
        chessRooms[roomId].players.playerTwo = socket.id;
      }

      // Emit initial setup to all clients in the room
      io.to(socket.id).emit("get_initial_setup", {
        board: chessRooms[roomId].board,
        turn: "white",
        pieceHandling:
          chessRooms[roomId].players.playerOne === socket.id
            ? "white"
            : "black",
      });
    } else {
      console.log("ROOM IS FULL ...........");
    }
  });

  // Update Game Details
  socket.on("update_details", (roomId: string, details: any) => {
    const payload = {
      board: details.board,
      turn: details.turn,
      result: details.result,
      players: chessRooms?.[roomId]?.players,
    };

    // Update room details
    const id =
      chessRooms?.[roomId]?.players.playerOne === socket.id
        ? chessRooms?.[roomId]?.players.playerTwo
        : chessRooms?.[roomId]?.players.playerOne;

    console.log("hit update_details", {
      det: chessRooms[roomId],
      roomId,
      id,
      chessRooms,
    });

    // Emit updated details to all clients in the room
    io.to(id).emit("get_updated_details", payload);
  });
});

const PORT = 1564;
server.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});

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
