import { Router } from "express";
/**
 * Rather than inlining all of the request handling logic, the functions are moved to a separate "controller" file. Ultimately, whether the functions are inlined or imported from a separate file, this Express app works the same.
 */

// Request handlers for the Users
import {
  getUsers,
  getUserById,
  createUser,
  deleteUserById,
} from "./users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUserById);

export default router;
