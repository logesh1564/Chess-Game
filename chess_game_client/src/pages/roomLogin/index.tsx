import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./roomLogin.module.css";

export const RoomLogin = () => {
  const navigate = useNavigate();
  // const { setRoomId } = useContext(GameContext);
  const [roomIdentifier, setIdentifier] = useState("");

  const joinTheRoomHanlder = () => {
    console.log("comming here");
    navigate(`/home/chessRoom/${roomIdentifier}`);
  };

  return (
    <main className={styles.roomLoginContainer}>
      <section className={styles.roomContentContainer}>
        <header className={styles.roomLoginHeader}>
          MultiPlayer Chess Game
        </header>
        <section className={styles.inputContainer}>
          <div>Enter The Room Id.</div>
          <input onChange={(e) => setIdentifier(e.target.value)} />
        </section>
        <button onClick={joinTheRoomHanlder} disabled={!roomIdentifier}>
          Join the Room
        </button>
      </section>
    </main>
  );
};

// <GameContext.Provider
//   value={{
//     board,
//     setBoard,
//     turn,
//     setTurn,
//     gameEndDetails,
//     setGameEndDetails,
//     roomId,
//     currentPiece,
//     setRoomId,
//   }}
// >
//   <main className={styles.appContainer}>
//     {roomId ? (
//       <section className={styles.appBoardCard}>
//         <ChessBoard />
//       </section>
//     ) : (
//       <RoomLogin />
//     )}
//   </main>
// </GameContext.Provider>
