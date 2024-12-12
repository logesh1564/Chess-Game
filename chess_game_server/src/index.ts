import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./Routes/authRoutes";

//  configs
import "./config/database";
import { userRoutes } from "./Routes/userRoutes";
import {
  joinGameController,
  updateGameDetailsController,
} from "./controllers/socket";
import { socketAuth } from "./controllers/auth";

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

io.use(socketAuth);
io.on("connection", (socket) => {
  // Join a Game Room
  socket.on("join_game", (roomId: string) =>
    joinGameController(socket, roomId, chessRooms)
  );
  // Update Game Details
  socket.on("update_details", (roomId: string, details: any, callback) =>
    updateGameDetailsController(socket, roomId, details, callback, chessRooms)
  );
});
//  -----------> socket setup and logic - END  <---------------

app.use(router);
app.use(userRoutes);

const PORT = process.env.PORT || 1564;
server.listen(PORT, () => console.log(`app started on port ${PORT}`));
