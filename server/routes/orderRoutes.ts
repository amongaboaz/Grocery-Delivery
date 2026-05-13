import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrderLocation,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orderContoller.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.get("/all", auth, admin, getAllOrders);
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);

// User routes
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/:id/location", auth, getOrderLocation);
orderRouter.get("/:id", auth, getOrder);

export default orderRouter;