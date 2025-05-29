import express from "express";
import { AuthenticationController } from "../controllers";
import { requiresAuthentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/register", AuthenticationController.register);
router.post("/login", AuthenticationController.login);
router.get("/me", requiresAuthentication, AuthenticationController.me);
router.delete(
	"/remove",
	requiresAuthentication,
	AuthenticationController.remove,
);

export default router;
