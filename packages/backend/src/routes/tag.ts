import express from "express";
import { TagController } from "../controllers";
import { requiresAuthentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/add", requiresAuthentication, TagController.addTag);
router.delete(
	"/remove/:tagId",
	requiresAuthentication,
	TagController.removeTag,
);
router.get("/", requiresAuthentication, TagController.getTags);
router.post("/edit/:tagId", requiresAuthentication, TagController.editTag);

export default router;
