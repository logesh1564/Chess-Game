import { Request, Response, NextFunction } from "express";
import { userModal } from "../models/userDetails";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req?.user as any;
  try {
    const userRecord = await userModal.findById(user?.id || user?._id, {
      username: 1,
      currentGameId: 1,
      createdDate: 1,
    });

    if (userRecord) {
      return res.status(200).json({
        data: {
          user: userRecord,
        },
      });
    }
    return res.status(400).json({
      data: {
        error: "Invalid User!",
      },
    });
  } catch (e) {
    res.status(400).json({
      data: {
        error: "Invalid User!",
      },
    });
  }
};
