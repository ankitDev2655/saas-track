import pool from "../config/db";
import { User } from "../models/user.model";



export const createUser = async (user: User) => {
    const { name, email, password, role_id } = user;
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, password, role_id]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

export const getAllUsers = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM users`);
        return result.rows;
    } finally {
        client.release();
    }
};

export const getUserById = async (id: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

export const updateUser = async (id: number, user: Partial<User>) => {
    const { name, email, password, role_id } = user;
    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), role_id = COALESCE($4, role_id) WHERE id = $5 RETURNING *`,
            [name, email, password, role_id, id]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

export const deleteUser = async (id: number) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
};
