import pool from "../config/db";
import { Role } from "../models/role.model";

// Create a new role
export const createRole = async (name: string): Promise<Role | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO roles (name) VALUES ($1) RETURNING *`,
            [name]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating role:", error);
        return null;
    } finally {
        client.release();
    }
};

// Get all roles
export const getAllRoles = async (): Promise<Role[]> => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM roles`);
        return result.rows;
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    } finally {
        client.release();
    }
};

// Get a role by ID
export const getRoleById = async (roleId: number): Promise<Role | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM roles WHERE id = $1`, [roleId]);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error fetching role by ID:", error);
        return null;
    } finally {
        client.release();
    }
};

// Delete a role
export const deleteRole = async (roleId: number): Promise<boolean> => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM roles WHERE id = $1 RETURNING *`, [roleId]);
        return result.rows[0] || false;
    } catch (error) {
        console.error("Error deleting role:", error);
        return false;
    } finally {
        client.release();
    }
};

