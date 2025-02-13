import pool from "../config/db";
import { Tenant } from "../models/tenant.model";

// 🚀 Create a new tenant (schema + DB record)
export const createTenantService = async (tenantName: string, createdBy: number): Promise<Tenant | null> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Create an isolated schema
        await client.query(`CREATE SCHEMA IF NOT EXISTS "${tenantName}"`);

        // Insert tenant record
        const result = await client.query(
            `INSERT INTO tenants (name, schema_name, created_by) VALUES ($1, $2, $3) RETURNING *`,
            [tenantName, tenantName, createdBy]
        );

        await client.query("COMMIT");
        console.log(`✅ Tenant "${tenantName}" created successfully.`);
        return result.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Error creating tenant:", error);
        throw new Error("Failed to create tenant.");
    } finally {
        client.release();
    }
};

// 🚀 Get all tenants
export const getAllTenantsService = async (): Promise<Tenant[]> => {
    try {
        const result = await pool.query("SELECT * FROM tenants");
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching tenants:", error);
        throw new Error("Failed to fetch tenants.");
    }
};

// 🚀 Get a tenant by ID
export const getTenantByIdService = async (id: number): Promise<Tenant | null> => {
    try {
        const result = await pool.query("SELECT * FROM tenants WHERE id = $1", [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error("❌ Error fetching tenant by ID:", error);
        throw new Error("Failed to fetch tenant.");
    }
};

// 🚀 Update tenant name & schema
export const updateTenantService = async (id: number, newTenantName: string): Promise<Tenant | null> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Get existing tenant info
        const tenantResult = await client.query("SELECT * FROM tenants WHERE id = $1", [id]);
        if (tenantResult.rows.length === 0) {
            throw new Error("Tenant not found");
        }

        const oldSchemaName = tenantResult.rows[0].schema_name;

        // Rename the schema
        await client.query(`ALTER SCHEMA "${oldSchemaName}" RENAME TO "${newTenantName}"`);

        // Update tenant record
        const updatedTenant = await client.query(
            `UPDATE tenants SET name = $1, schema_name = $2 WHERE id = $3 RETURNING *`,
            [newTenantName, newTenantName, id]
        );

        await client.query("COMMIT");
        console.log(`✅ Tenant "${oldSchemaName}" renamed to "${newTenantName}".`);
        return updatedTenant.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Error renaming tenant:", error);
        throw new Error("Failed to rename tenant.");
    } finally {
        client.release();
    }
};

// 🚀 Delete a tenant & drop schema
export const deleteTenantService = async (id: number): Promise<boolean> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Get schema name
        const tenantResult = await client.query("SELECT schema_name FROM tenants WHERE id = $1", [id]);
        if (tenantResult.rows.length === 0) {
            throw new Error("Tenant not found");
        }

        const schemaName = tenantResult.rows[0].schema_name;

        // Drop schema
        await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);

        // Delete tenant record
        const deleteResult = await client.query("DELETE FROM tenants WHERE id = $1 RETURNING *", [id]);

        await client.query("COMMIT");
        console.log(`✅ Tenant "${schemaName}" deleted successfully.`);
        return deleteResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("❌ Error deleting tenant:", error);
        throw new Error("Failed to delete tenant.");
    } finally {
        client.release();
    }
};
