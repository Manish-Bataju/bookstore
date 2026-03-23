import express from "express";
const orderRouter = express.Router();

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validator.js";
import {
  orderJoiSchema,
  updateStatusJoiSchema,
} from "../validations/orderValidations.js";

//customer and admins
orderRouter.post("/", protect, validateRequest(orderJoiSchema), createOrder);
orderRouter.get("/myOrder", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);

//admin only routes
orderRouter.get("/", protect, admin, getAllOrders);
orderRouter.put(
  "/:id/status",
  protect,
  admin,
  validateRequest(updateStatusJoiSchema),
  updateOrderStatus,
);

export default orderRouter;
