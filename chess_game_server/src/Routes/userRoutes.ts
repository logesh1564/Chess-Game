import { Router } from "express";
import { getUserDetails } from "../controllers/userDetails";
import { isAuthorizedUser } from "../controllers/authController";

export const userRoutes = Router();

userRoutes
  .route("/api/getUserDetails")
  .get(isAuthorizedUser, getUserDetails)
  .post(isAuthorizedUser, getUserDetails);
