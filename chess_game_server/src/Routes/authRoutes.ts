import { Router } from "express";
import { signin, signup } from "../controllers/authController";

export const router = Router();

router.post("/api/login", signin);
router.post("/api/register", signup);

router.post("/forgotPassword", () => {});
router.post("/resetPassword", () => {});
