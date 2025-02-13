import express, { Request, Response, NextFunction } from "express";
import {
    createRoleController,
    getRoleByIdController,
    deleteRoleController,
    getAllRolesController,
} from "../controllers/role.controller";

const router = express.Router();

// ✅ Fix: Explicitly type `next` as `NextFunction`
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Define routes
router.post("/role/create", asyncHandler(createRoleController));
router.get("/roles", asyncHandler(getAllRolesController));
router.get("/role/:roleId", asyncHandler(getRoleByIdController));
router.delete("/role/:roleId", asyncHandler(deleteRoleController));

export default router;
