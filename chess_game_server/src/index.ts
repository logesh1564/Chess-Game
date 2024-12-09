import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { getInitialSetup } from "./utils/pieceSetupHelpers";
import { router } from "./Routes/authRoutes";

//  configs
import "./config/database";
import { userRoutes } from "./Routes/userRoutes";
import { updateGameDetailsController } from "./controllers/socket";
import { verifyToken } from "./controllers/authController";
import { userModal } from "./models/userDetails";

const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React app 1
      "http://localhost:5173", // React app 2
      "https://chess-game-7rvw.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Allowed headers
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

//  ----------------> socket setup and logic - START <---------------
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const chessRooms: Record<string, any> = {};

io.use(async (socket, next) => {
  const token: string = socket?.handshake?.query?.token as string;

  try {
    if (!token)
      return next(new Error("Authentication error: No token provided"));
    const decodedData: any = await (verifyToken(token) as Promise<{
      id: string;
    }>);

    const currentUser = await userModal.findById(decodedData.id);
    if (!currentUser)
      return new Error(
        "the token belonging to this user does no longer exists"
      );

    if (
      currentUser &&
      !(currentUser as any)?.changedPasswordAfter(decodedData.iat)
    ) {
      return new Error("User Recently Changed the password");
    }

    (socket as any).user = currentUser;
    next();
  } catch (e) {
    return next(
      new Error("the token belonging to this user does no longer exists")
    );
  }
});
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
  socket.on("update_details", (roomId: string, details: any, callback) => {
    updateGameDetailsController(socket, roomId, details, callback, chessRooms);
  });
});
//  -----------> socket setup and logic - END  <---------------

app.use(router);
app.use(userRoutes);

const PORT = process.env.PORT || 1564;
server.listen(PORT, () => {
  console.log(`app started on port ${PORT}`);
});
