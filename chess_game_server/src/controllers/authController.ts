import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { userModal } from "../models/userDetails";
import { getPasswordHash, validatePassword } from "../utils/passwordHashing";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-very-strong-secreat";
const JWT_EXPRIES_IN = process.env.JWT_EXPRIES_IN || "10d";

export const signToken = (id: string) => {
  return jwt.sign({ id: id }, JWT_SECRET, {
    expiresIn: JWT_EXPRIES_IN,
  });
};

export const verifyToken = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err); // Reject the promise on error
      } else {
        resolve(decoded as jwt.JwtPayload); // Resolve the promise with decoded data
      }
    });
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  try {
    const user = await userModal
      .findOne({
        username,
      })
      .select("+password");
    console.log({ user });
    if (user) {
      res.status(400).json({ data: { error: "username already there!" } });
      //  needs to send user Already Exists
    } else {
      const { hash, salt } = getPasswordHash(password);
      //  needs to create
      const createdUser = await userModal.create({
        username,
        password: hash,
        salt,
      });
      res.status(201).json({
        status: "success",
        data: {
          user: createdUser,
        },
      });
    }
  } catch (err) {
    res.status(400).json({ data: { error: "There is some issuse." } });
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ data: { error: "username or password Mantory!" } });

  try {
    const user = await userModal
      .findOne({
        username,
      })
      .select("+password +salt");

    if (user) {
      const isValidPassWord = validatePassword(
        password,
        user.password,
        user.salt
      );
      if (isValidPassWord) {
        // 1. needs to create a JWT token
        const jwtToken = signToken(user?._id?.toString());
        console.log({ jwtToken });
        // 2. send to the user
        //  needs to call the
        return res.status(200).json({
          status: "success",
          data: {
            token: jwtToken,
          },
        });
      }
    }

    return res
      .status(400)
      .json({ data: { error: "Incorrect username or password" } });
  } catch (e) {
    console.log(e);
    res.status(400).json({ data: { error: "There is some issuse." } });
  }
};

export const isAuthorizedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. get the token from user
  // 2. validate the token (isExpired or not)
  // 3. check if user still exists
  // 4. check is the user changed password after the token was issused.
  try {
    // Step One:
    let token = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "you are not logged in! Please log in to get access.",
      });
    }

    // 2. validate the token (isExpired or not) - if not go to catch block
    const decodedData: any = await (verifyToken(token) as Promise<{
      id: string;
    }>);

    //  3. check if user still exists
    const currentUser = await userModal.findById(decodedData.id);
    if (!currentUser)
      return res.status(401).json({
        status: "the token belonging to this user does no longer exists",
      });

    // 4. check is the user changed password after the token was issused.
    if (
      currentUser &&
      !(currentUser as any)?.changedPasswordAfter(decodedData.iat)
    ) {
      return res
        .status(401)
        .json({ status: "User Recently Changed the password" });
    }

    req.user = currentUser as any;

    next();
  } catch (e) {
    res.status(401).json({
      status: e,
    });
  }
};
