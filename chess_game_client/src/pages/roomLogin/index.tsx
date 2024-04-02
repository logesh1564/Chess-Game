import React, { useContext, useState } from "react";
import styles from "./roomLogin.module.css";
import { GameContext } from "../../App";
import { SocketServiceInstance } from "../../service/socket";

export const RoomLogin = () => {
  const { setRoomId } = useContext(GameContext);
  const [roomIdentifier, setIdentifier] = useState("");
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
        <button
          onClick={() => {
            SocketServiceInstance.joinToGame(roomIdentifier);
            setRoomId(roomIdentifier);
          }}
          disabled={!roomIdentifier}
        >
          Join the Room
        </button>
      </section>
    </main>
  );
};
