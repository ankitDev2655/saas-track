import { Pool, Client, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a global connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    max: 10, // Maximum connections allowed
    idleTimeoutMillis: 30000, // Close idle clients after 30 sec
    connectionTimeoutMillis: 5000, // Timeout for connection attempts
});

const ensureTables = async (client: PoolClient) => {
    try {
        // Create roles first (no dependencies)
        await client.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create users (depends on roles)
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role_id INT REFERENCES roles(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create tenants (depends on users)
        await client.query(`
            CREATE TABLE IF NOT EXISTS tenants (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                schema_name TEXT UNIQUE NOT NULL,
                created_by INT REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Roles, Users, and Tenants tables ensured.");
    } catch (error) {
        console.error("❌ Error ensuring tables:", error);
    }
};



// 🚀 Function to create a new tenant schema
export const createTenantSchema = async (tenantName: string) => {
    const client = await pool.connect();
    try {
        await client.query(`CREATE SCHEMA IF NOT EXISTS "${tenantName}"`);
        console.log(`✅ Schema "${tenantName}" created successfully`);
    } catch (error) {
        console.error("❌ Error creating tenant schema:", error);
    } finally {
        client.release();
    }
};

// 🚀 Get a tenant-specific DB client (for multi-tenancy)
export const getTenantDBClient = (tenantName: string) => {
    return new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        statement_timeout: 5000,
        query_timeout: 5000,
        options: `-c search_path=${tenantName}`,
    });
};

// 🚀 Initialize the database setup
const initializeDB = async () => {
    const client = await pool.connect();
    try {
        console.log("✅ Database connected successfully");
        await ensureTables(client);
    } catch (err) {
        console.error("❌ Database initialization error:", err);
    } finally {
        client.release();
    }
};

// Start DB Initialization
initializeDB();

export default pool;
