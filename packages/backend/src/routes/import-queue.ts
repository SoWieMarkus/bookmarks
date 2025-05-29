import express from "express";
import { ImportQueueController } from "../controllers";
import { requiresAuthentication } from "../middlewares/authentication";

const router = express.Router();

router.post(
	"/add",
	requiresAuthentication,
	ImportQueueController.addLinksToImportQueue,
);
router.delete(
	"/remove/:itemId",
	requiresAuthentication,
	ImportQueueController.removeImportQueueItem,
);
router.get("/", requiresAuthentication, ImportQueueController.getImportQueue);

export default router;
