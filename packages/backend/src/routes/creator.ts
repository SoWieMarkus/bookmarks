import express from "express";
import { CreatorController } from "../controllers";
import { requiresAuthentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/add", requiresAuthentication, CreatorController.addCreator);
router.delete(
	"/remove/:creatorId",
	requiresAuthentication,
	CreatorController.removeCreator,
);
router.get("/", requiresAuthentication, CreatorController.getCreators);
router.post(
	"/edit/:creatorId",
	requiresAuthentication,
	CreatorController.editCreator,
);

export default router;
