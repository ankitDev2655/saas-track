import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { User } from "../models/user.model";

// 🟢 Register a new user
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role_id } = req.body;
        const newUser: User = { name, email, password, role_id };

        const user = await registerUser(newUser);
        if (!user) {
            return res.status(400).json({ message: "User registration failed" });
        }

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// 🟢 Login user and return JWT
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);

        if (!token) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
