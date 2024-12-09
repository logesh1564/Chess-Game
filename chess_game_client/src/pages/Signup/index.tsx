import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/button";
import { CustomInput } from "../../components/CustomInput";

import { registerUser } from "../../service";
import styles from "./signup.module.css";

export const Signup = (): JSX.Element => {
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

  const onRegisterHandler = async () => {
    try {
      const result = await registerUser({ username: email, password });
      navigate("/login");
      console.log({ result });
    } catch (e) {
      navigate("/login");
      console.log(e);
    }
  };

  const goToLogIn = () => {
    navigate("/login");
  };

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

          <Button onClick={onRegisterHandler} disabled={!isValid()}>
            <div className={styles.loginBtnLabel}>Sign Up</div>
          </Button>
        </div>
        <section className={styles.loginFormfotterCard}>
          New?{" "}
          <span onClick={goToLogIn}>Sign up - and start playing chess!</span>
        </section>
      </article>
    </main>
  );
};
