import React, {
  createContext,
  useContext,
  // useContext,
  useEffect,
} from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { RoomLogin } from "./pages/roomLogin";
import { ChessRoom } from "./pages/chessRoom";

import { GAME_RESULT_TYPE } from "./service/socket";
import { GridDataType } from "./types";
import { GRID_COLORS } from "./constant";

import { getUserDetails } from "./service";
import { isAuthenticated } from "./utils/auth";
import styles from "./app.module.css";
import { UserDetailsContext } from "./store/userSlice";
// import { UserDetailsContext } from "./store/userSlice";

interface GameContextType {
  board: GridDataType[][];
  setBoard: React.Dispatch<React.SetStateAction<GridDataType[][]>>;
  turn: GRID_COLORS;
  setTurn: React.Dispatch<React.SetStateAction<GRID_COLORS>>;
  gameEndDetails: GAME_RESULT_TYPE;
  setGameEndDetails: React.Dispatch<React.SetStateAction<GAME_RESULT_TYPE>>;
  roomId: string;
  currentPiece: GRID_COLORS;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextType>({
  board: [],
  setBoard: () => {},
  turn: GRID_COLORS.WHITE,
  setTurn: () => {},
  gameEndDetails: null,
  setGameEndDetails: () => {},
  roomId: "",
  currentPiece: GRID_COLORS.WHITE,
  setRoomId: () => {},
});

export const App = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = window.localStorage.getItem("lc-dev-userId");
  const { dispatchUserDetails } = useContext(UserDetailsContext);

  useEffect(() => {
    if (token && isAuthenticated()) {
      if (!location.pathname.startsWith("/home"))
        navigate("/home/chessRoomLogin");
      getUserDetails()
        .then((data) => {
          dispatchUserDetails(data.user);
          console.log("success.....");
        })
        .catch((e) => {
          localStorage.removeItem("lc-dev-userId");
          console.log(e);
        });
    }
  }, [token]);

  return (
    <main className={styles.appContainer}>
      <Navigation />
    </main>
  );
};

const Navigation = (): JSX.Element => {
  return (
    <Routes>
      {/* {!isAuthenticated() && ( */}
      {/* <> */}
      <Route path={"/login"} element={<Login />} />
      <Route path={"/signup"} element={<Signup />} />
      {/* </> */}
      {/* )} */}

      <Route path={"/home/chessRoomLogin"} element={<RoomLogin />} />
      <Route path={"/home/chessRoom/:roomId"} element={<ChessRoom />} />

      <Route
        path={"/"}
        element={!isAuthenticated() ? <Login /> : <RoomLogin />}
      />

      {/* <Route path="*" element={<>Page Not Found</>} /> */}
    </Routes>
  );
};
