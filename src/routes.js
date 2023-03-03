const express = require("express");
const routes = express.Router();
const { auth, authAdmin } = require("./middleware/auth");
const AuthController = require('./app/controllers/AuthController');
const AdminUserController = require('./app/controllers/AdminUserController');
const UserController = require('./app/controllers/UserController')

// Health
routes.get("/health", AuthController.getHealth);

// Auth
routes.post("/auth/login", AuthController.login);

// User
routes.get("/user", auth, UserController.index);
routes.get("/user/:id", auth, UserController.show);
routes.post("/user", UserController.store);
routes.put("/user/:id", auth, UserController.update);
routes.delete("/user/:id", auth, UserController.destroy);
routes.delete("/user-count", auth, UserController.getCount);

// Admin User
routes.get("/admin-user", authAdmin, AdminUserController.index);
routes.get("/admin-user/:id", authAdmin, AdminUserController.show);
routes.post("/admin-user", authAdmin, AdminUserController.store);
routes.put("/admin-user/:id", authAdmin, AdminUserController.update);
routes.delete("/admin-user/:id", authAdmin, AdminUserController.destroy);

module.exports = routes;