import { Router } from "express";
import {
    createTenantController,
    getAllTenantsController,
    getTenantByIdController,
    updateTenantController,
    deleteTenantController
} from '../controllers/tenant.controller';
import asyncHandler from "../middlewares/asyncHandler.middleware";

const router = Router();

router.post("/tenant/new", asyncHandler(createTenantController));
router.get("/tenants", asyncHandler(getAllTenantsController));
router.get("/tenant/:id", asyncHandler(getTenantByIdController));
router.put("/tenant/:id", asyncHandler(updateTenantController));
router.delete("/tenant/:id", asyncHandler(deleteTenantController));

export default router;
