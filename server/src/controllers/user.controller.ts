import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await userService.deleteUser(Number(req.params.id));
        if (!deleted) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};
