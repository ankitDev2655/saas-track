import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db"; // Import database connection
import { ensureTenantAdminsTable } from "../services/tenant-admin.service";
import userRoutes from "../routes/user.routes";
import tenantRoutes from "../routes/tenant.routes";
import roleRoutes from "../routes/role.routes";
import tenantAdminRoutes from "../routes/tenant-admin.routes";

const router = Router();

// Health check route
router.get("/health", async (req: Request, res: Response) => {
    try {
        const dbCheck = await pool.query("SELECT 1+1 AS result");
        res.json({
            message: "✅ SaaS Backend is running...",
            dbStatus: dbCheck.rows[0],
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        res.status(500).json({ message: "Database connection failed", error });
    }
});

// Base route
router.get("/", (req: Request, res: Response) => {
    res.send("✅ SaaS Backend is running...");
});

// Ensure tenant_admins table exists
ensureTenantAdminsTable();

// Register API routes
router.use("/api/v1", roleRoutes);
router.use("/api/v1", userRoutes);
router.use("/api/v1", tenantRoutes);
router.use("/api/v1", tenantAdminRoutes);


// Catch-all route for undefined endpoints
router.use("*", (req: Request, res: Response) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

export default router;
