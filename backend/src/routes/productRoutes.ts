import {Router} from "express";
import {requireAuth} from  "@clerk/express";
import * as productController from "../controllers/productController";

const router  = Router();

//GET -> /api/products -> to get all products (public route)
router.get("/", productController.getAllProducts);

// GET api/products/my -> to  get all products of the logged in user (private route)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET api/products/:id -> to get a single product by id (public route)
router.get("/:id", productController.getProductById);

//POST api/products -> to create a new  product(protected route)
router.get("/", requireAuth(), productController.createProduct);

//PUT api/products/:id -> Update product - protected(owner only)
router.put("/:id", requireAuth(), productController.updateProduct);

//DELETE api/products/:id -> delete product - protected(owner only)
router.delete("/:id", requireAuth(), productController.deleteProduct);




export default router ;