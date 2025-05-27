import express from "express";
import { PostController } from "../controllers";
import { requiresAuthentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/add", requiresAuthentication, PostController.addPost);
router.post(
    "/edit/:postId",
    requiresAuthentication,
    PostController.editPost,
);
router.delete(
    "/remove/:postId",
    requiresAuthentication,
    PostController.removePost,
);
router.get("/", requiresAuthentication, PostController.getPosts);
router.post(
    "/queue/:postId",
    requiresAuthentication,
    PostController.readLater,
);

router.get(
    "/:postId",
    requiresAuthentication,
    PostController.getPost,
);

router.post("/url", requiresAuthentication, PostController.parseByUrl);

export default router;