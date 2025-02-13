import express from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/user/new", asyncHandler(createUserController));
router.get("/users", asyncHandler(getAllUsersController));
router.get("/user/:id", asyncHandler(getUserByIdController));
router.put("/user/:id", asyncHandler(updateUserController));
router.delete("/user/:id", asyncHandler(deleteUserController));

export default router;
