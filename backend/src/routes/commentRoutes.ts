import { Router } from "express";
import * as commentController from "../controllers/commentController";
import { requireAuth } from "@clerk/express";

const router = Router();

//POST api/comments/:productId - add comment to product(protected)

router.post("/:productId", requireAuth(), commentController.createComment);

//DELETE api/comments/:commentId - delete comment (protected)
router.delete("/:commentId", requireAuth(), commentController.deleteComment);

export default router;