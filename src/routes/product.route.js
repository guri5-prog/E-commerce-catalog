import express from "express";
import {
  getAllProducts,
  getProductById,
  getLowStockProducts,
  getCategoryRatings,
  updateStock,
  addReview
} from "../controllers/product.controller.js";

const router = express.Router();

// Main routes
router.get("/",                              getAllProducts);
router.get("/:id",                           getProductById);

// Aggregation routes
router.get("/aggregation/low-stock",         getLowStockProducts);
router.get("/aggregation/category-ratings",  getCategoryRatings);

// Stock & review management
router.patch("/:id/stock",                   updateStock);
router.post("/:id/reviews",                  addReview);

export default router;
