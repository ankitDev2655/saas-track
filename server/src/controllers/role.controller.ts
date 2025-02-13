import { Request, Response } from "express";
import { createRole, getAllRoles, getRoleById, deleteRole } from "../services/role.service";

// Create a new role
export const createRoleController = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Role name is required" });

    const role = await createRole(name);
    if (!role) return res.status(500).json({ error: "Failed to create role" });

    res.status(201).json({ message: "Role created successfully", role });
};

// Get all roles
export const getAllRolesController = async (req: Request, res: Response) => {
    const roles = await getAllRoles();
    res.status(200).json({ roles });
};

// Get role by ID
export const getRoleByIdController = async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) return res.status(400).json({ error: "Invalid role ID" });

    const role = await getRoleById(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });

    res.status(200).json({ role });
};

// Delete role by ID
export const deleteRoleController = async (req: Request, res: Response) => {
    const roleId = parseInt(req.params.roleId);
    if (isNaN(roleId)) return res.status(400).json({ error: "Invalid role ID" });

    const deleted = await deleteRole(roleId);
    if (!deleted) return res.status(404).json({ error: "Role not found or cannot be deleted" });

    res.status(200).json({ message: "Role deleted successfully" });
};
