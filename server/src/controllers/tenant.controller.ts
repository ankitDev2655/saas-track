import { Request, Response } from "express";
import {
    createTenantService,
    getAllTenantsService,
    getTenantByIdService,
    updateTenantService,
    deleteTenantService
} from "../services/tenant.service";

export const createTenantController = async (req: Request, res: Response) => {
    try {
        const { tenantName, createdBy } = req.body;
        if (!tenantName || !createdBy) {
            return res.status(400).json({ error: "Tenant name and createdBy are required" });
        }

        const tenant = await createTenantService(tenantName, createdBy);
        res.status(201).json({ message: "Tenant created successfully", tenant });
    } catch (error) {
        console.error("❌ Error creating tenant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllTenantsController = async (_req: Request, res: Response) => {
    try {
        const tenants = await getAllTenantsService();
        res.status(200).json({ tenants });
    } catch (error) {
        console.error("❌ Error fetching tenants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getTenantByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tenant = await getTenantByIdService(Number(id));

        if (!tenant) {
            return res.status(404).json({ error: "Tenant not found" });
        }

        res.status(200).json({ tenant });
    } catch (error) {
        console.error("❌ Error fetching tenant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateTenantController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newTenantName } = req.body;

        if (!newTenantName) {
            return res.status(400).json({ error: "New tenant name is required" });
        }

        const updatedTenant = await updateTenantService(Number(id), newTenantName);
        res.status(200).json({ message: "Tenant updated successfully", updatedTenant });
    } catch (error) {
        console.error("❌ Error updating tenant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteTenantController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await deleteTenantService(Number(id));
        res.status(200).json({ message: "Tenant deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting tenant:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
