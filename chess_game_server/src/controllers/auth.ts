import { Request, Response, NextFunction } from "express";
// import passport from "passport";
import { userModal } from "../models/userDetails";
import { getPasswordHash } from "../utils/passwordHashing";

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
