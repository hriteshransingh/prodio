import { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";



export const createComment = async (req: Request, res: Response) => {
  try {


    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;

    const existingProduct = await queries.getProductById(productId as string);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = await queries.createComment({
      content,
      userId,
      productId: productId as string,
    });
  } catch (error) {
    console.log("Error creating comment",error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {

    const {userId} = getAuth(req);
    if(!userId){
        return res.status(401).json({error: "Unauthorized"});
    }


    const { commentId } = req.params;

    const existingComment = await queries.getCommentById(commentId as string);

    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if(existingComment.userId !== userId){
        return res.status(403).json({error: "You can only delete your own product"});
    }

     await queries.deleteComment(commentId as string);
    res.status(200).json({message: "Comment deleted successfully"});
  } catch (error) {
    console.log("Error deleting comment",error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
