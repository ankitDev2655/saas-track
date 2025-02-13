import { Request, Response } from "express";
import {
    createTenantAdmin,
    getAllTenantAdmins,
    getTenantAdminById,
    updateTenantAdmin,
    deleteTenantAdmin
} from "../services/tenant-admin.service";

// 🚀 Create Tenant Admin
export const createTenantAdminController = async (req: Request, res: Response) => {
    try {
        const { tenant_id, user_id, assigned_by } = req.body;
        if (!tenant_id || !user_id || !assigned_by) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newAdmin = await createTenantAdmin({ tenant_id, user_id, assigned_by });
        res.status(201).json({ message: "Tenant Admin created successfully", data: newAdmin });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🚀 Get All Tenant Admins
export const getAllTenantAdminsController = async (_req: Request, res: Response) => {
    try {
        const admins = await getAllTenantAdmins();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🚀 Get Single Tenant Admin
export const getTenantAdminByIdController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const admin = await getTenantAdminById(id);
        if (!admin) return res.status(404).json({ error: "Not found" });

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🚀 Update Tenant Admin
export const updateTenantAdminController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body;
        const updatedAdmin = await updateTenantAdmin(id, updates);
        if (!updatedAdmin) return res.status(404).json({ error: "Not found" });

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🚀 Delete Tenant Admin
export const deleteTenantAdminController = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deletedAdmin = await deleteTenantAdmin(id);
        if (!deletedAdmin) return res.status(404).json({ error: "Not found" });

        res.status(200).json({ message: "Deleted successfully", data: deletedAdmin });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
