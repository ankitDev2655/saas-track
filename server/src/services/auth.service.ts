import pool from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";  // Store in .env file

// 🔹 Register a new user
export const registerUser = async (user: User): Promise<User | null> => {
    const client = await pool.connect();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const result = await client.query(
            `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role_id, created_at`,
            [user.name, user.email, hashedPassword, user.role_id || null]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    } finally {
        client.release();
    }
};

// 🔹 Authenticate user and return JWT token
export const loginUser = async (email: string, password: string): Promise<string | null> => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if (result.rows.length === 0) {
            return null; // User not found
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return null; // Invalid password
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, JWT_SECRET, {
            expiresIn: "1h",
        });

        return token;
    } catch (error) {
        console.error("Error logging in:", error);
        return null;
    } finally {
        client.release();
    }
};
