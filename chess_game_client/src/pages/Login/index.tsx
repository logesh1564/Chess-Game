import { useState } from "react";

import { Button } from "../../components/button";
import { CustomInput } from "../../components/CustomInput";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../service";
import styles from "./login.module.css";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const emailHandler = (data: string) => setEmail(data);
  const passwordHandler = (data: string) => setPassword(data);

  const isValid = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    if (!password?.trim()) return false;
    return true;
  };

  const onLoginHandler = async () => {
    try {
      const token = await loginUser({ username: email, password });
      console.log({ token });
      if (token && typeof token === "string") {
        window.localStorage.setItem("lc-dev-userId", token);
        navigate("/home/chessRoomLogin");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goToSignUp = () => navigate("/signup");

  return (
    <main className={styles.container}>
      <header>Fun With Friends</header>
      <article className={styles.loginFormWrapper}>
        <div className={styles.loginFormInnerCard}>
          <div>
            <CustomInput
              onChange={emailHandler}
              placeHolder="Enter your Email"
              value={email}
            />
            <CustomInput
              onChange={passwordHandler}
              placeHolder="Enter your Password"
              value={password}
            />
          </div>

          <Button disabled={!isValid()} onClick={() => onLoginHandler()}>
            <div className={styles.loginBtnLabel}>Log In</div>
          </Button>
        </div>
        <section className={styles.loginFormfotterCard}>
          New?{" "}
          <span onClick={goToSignUp}>Sign up - and start playing chess!</span>
        </section>
      </article>
    </main>
  );
};
