import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { userModal } from "../models/userDetails";
import { validatePassword } from "../utils/passwordHashing";

type doneType = (
  error: any,
  user?: Express.User | false,
  options?: IVerifyOptions
) => void;

const verifyCallBack = async (
  username: string,
  password: string,
  done: doneType
) => {
  try {
    const user = await userModal.findOne({ name: username });
    if (!user) return done(null, false);
    else {
      if (
        !user.password ||
        !user.salt ||
        !validatePassword(password, user.password, user.salt)
      )
        return done(null, false, { message: "Incorrect password." });
      return done(null, user);
    }
  } catch (error) {
    done(error);
  }
};

const strategy = new LocalStrategy(verifyCallBack);
passport.use(strategy);

//  needs to fix the type issuse
passport.serializeUser((user: any, done) => {
  done(null, user?.id || user?._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await userModal.findById(userId);
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
