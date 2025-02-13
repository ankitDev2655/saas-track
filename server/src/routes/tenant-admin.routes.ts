import express from "express";
import {
    createTenantAdminController,
    getAllTenantAdminsController,
    getTenantAdminByIdController,
    updateTenantAdminController,
    deleteTenantAdminController
} from "../controllers/tenant-admin.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";

const router = express.Router();

router.post("/tenant-admin/new", asyncHandler(createTenantAdminController));
router.get("/tenant-admins", asyncHandler(getAllTenantAdminsController));
router.get("/tenant-admin/:id", asyncHandler(getTenantAdminByIdController));
router.put("/tenant-admin/:id", asyncHandler(updateTenantAdminController));
router.delete("/tenant-admin/:id", asyncHandler(deleteTenantAdminController));

export default router;
