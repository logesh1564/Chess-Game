import { connect, createConnection } from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://logesh:RrlSvdFrUI1O2YmR@multiplayerchessgame.pw2gb.mongodb.net/?retryWrites=true&w=majority&appName=MultiPlayerChessGame";

// if we use this method we can create muliple instance for handling multiple database connection


async function connectToMongo() {
  try {
    await connect(MONGO_URI, {
      tls: true,
      ssl: true,
      dbName: "chessGame",
    }); // Wait for the connection to resolve
    console.log("MongoDB connection established successfully!");
  } catch (err) {
    console.error("Error establishing MongoDB connection:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Call the function
connectToMongo();
