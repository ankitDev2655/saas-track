import pool from "../config/db";
import { TenantAdmin } from "../models/tenant-admin.model";

// 🚀 Ensure `tenant_admins` Table Exists
export const ensureTenantAdminsTable = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS tenant_admins (
                id SERIAL PRIMARY KEY,
                tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                assigned_by INT REFERENCES users(id) ON DELETE SET NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ TenantAdmins table ensured.");
    } catch (error) {
        console.error("❌ Error ensuring TenantAdmins table:", error);
    } finally {
        client.release();
    }
};

// 🚀 Create a Tenant Admin
export const createTenantAdmin = async (tenantAdmin: TenantAdmin) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO tenant_admins (tenant_id, user_id, assigned_by) VALUES ($1, $2, $3) RETURNING *;`,
            [tenantAdmin.tenant_id, tenantAdmin.user_id, tenantAdmin.assigned_by]
        );
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error creating tenant admin:", error);
        throw error;
    } finally {
        client.release();
    }
};

// 🚀 Get All Tenant Admins
export const getAllTenantAdmins = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM tenant_admins;`);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching tenant admins:", error);
        throw error;
    } finally {
        client.release();
    }
};

// 🚀 Get Tenant Admin by ID
export const getTenantAdminById = async (id: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM tenant_admins WHERE id = $1;`, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error fetching tenant admin:", error);
        throw error;
    } finally {
        client.release();
    }
};

// 🚀 Update Tenant Admin
export const updateTenantAdmin = async (id: number, updates: Partial<TenantAdmin>) => {
    const client = await pool.connect();
    try {
        const fields = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(", ");

        const values = Object.values(updates);
        values.push(id);

        const result = await client.query(
            `UPDATE tenant_admins SET ${fields} WHERE id = $${values.length} RETURNING *;`,
            values
        );

        return result.rows[0];
    } catch (error) {
        console.error("❌ Error updating tenant admin:", error);
        throw error;
    } finally {
        client.release();
    }
};

// 🚀 Delete Tenant Admin
export const deleteTenantAdmin = async (id: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM tenant_admins WHERE id = $1 RETURNING *;`, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error deleting tenant admin:", error);
        throw error;
    } finally {
        client.release();
    }
};
