import { Request, Response, NextFunction } from "express";
// import passport from "passport";
import { userModal } from "../models/userDetails";
import { getPasswordHash } from "../utils/passwordHashing";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { verifyToken } from "./authController";
import { ExtendedError } from "socket.io/dist/namespace";

export const registerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body; // Accessing values from the body
    if (!username || !password) {
      return res
        .status(400)
        .json({ data: { error: "Username and password are required" } });
    }

    const user = await userModal.findOne({
      name: username,
    });
    if (user) res.json({ data: { error: "username already there!" } });
    else {
      const { hash, salt } = getPasswordHash(password);
      await userModal.create({
        name: username,
        password: hash,
        salt: salt,
      });
      res.json({
        data: {
          message: "Successfully Registered!.",
        },
      });
    }
  } catch (e) {
    res.status(400).json({ data: { error: "There is some issuse." } });
  }
};

export const socketAuth = async (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  next: (err?: ExtendedError) => void
) => {
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
};
