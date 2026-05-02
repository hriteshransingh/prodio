import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";



export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await queries.getAllProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    console.error("Error getting all  products");
    res.status(500).json({ error: "Failed to get all products" });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return res.json({ error: "Unauthorized" });

    const myProducts = queries.getProductsByUserId(userId as string);
    res.status(200).json(myProducts);
  } catch (error) {
    console.error("Error getting user products:", error);
    res.status(500).json({ error: "Failed to get user products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const selectedProduct = queries.getProductById(id as string);
    res.status(200).json(selectedProduct);
  } catch (error) {
    console.log("Error getting product");
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const { title, description, imageUrl } = req.body;

    if (!title || !description || imageUrl) {
      return res
        .status(400)
        .json({ error: "title , description and imageUrl are required" });
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId: userId as string,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product", error);

    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const existingProduct = await queries.getProductById(id as string);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can only update your own products" });
    }

    const updatedProduct = await queries.updateProduct(id as string, {
      title,
      description,
      imageUrl,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error updating product", error);

    return res.status(500).json({ error: "Failed to update the product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const existingProduct = await queries.deleteProduct(id as string);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own products" });
    }

    const deletedProduct = await queries.deleteProduct(id as string);

    res.status(200).json({message: "Product deleted successfully"});
  } catch (error) {
    console.error("Error deleting product");
    res.status(500).json({ error: "Failed to delete the product" });
  }
};
