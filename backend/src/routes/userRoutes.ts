import {Router} from "express";
import {syncUser} from "../controllers/userController";
import {requireAuth} from "@clerk/express";

const router = Router();

// /api/user/sync -> POST request -> Sync the clerk user to database
router.post("sync",requireAuth(), syncUser); //it's a protected route

export default router;