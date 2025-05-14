// Importing necessary modules and functions
import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
// Importing controllers
import {
  register,
  getMe,
  logout,
  login,
} from "../controller/user.authController.js";
// Initializing express router
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getme").get(isAuthenticated, getMe);
router.route("/logout").post(isAuthenticated, logout);

// Exporting the router
export default router;
