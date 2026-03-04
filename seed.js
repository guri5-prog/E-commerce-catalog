import mongoose from "mongoose";
import Product from "../models/product.model.js";

export async function seedDB() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log("DB already seeded, skipping.");
    return;
  }

  const fakeUserId1 = new mongoose.Types.ObjectId();
  const fakeUserId2 = new mongoose.Types.ObjectId();
  const fakeUserId3 = new mongoose.Types.ObjectId();

  await Product.insertMany([
    {
      name: "Premium Headphones",
      category: "Electronics",
      variants: [
        { sku: "HP-BL-001", color: "Black", price: 199.99, stock: 15 },
        { sku: "HP-WH-001", color: "White", price: 209.99, stock: 8 }
      ],
      reviews: [
        { userId: fakeUserId1, rating: 5, comment: "Excellent sound quality" },
        { userId: fakeUserId2, rating: 4, comment: "Great but a bit pricey" }
      ],
      avgRating: 4.5
    },
    {
      name: "T-Shirt",
      category: "Clothing",
      variants: [
        { sku: "12345-S", color: "red",  size: "S", price: 19.99, stock: 5 },
        { sku: "12345-M", color: "blue", size: "M", price: 19.99, stock: 10 }
      ],
      reviews: [
        { userId: fakeUserId1, rating: 4, comment: "Nice fit" },
        { userId: fakeUserId3, rating: 5, comment: "Love it!" }
      ],
      avgRating: 4.5
    },
    {
      name: "Outdoor Headphones",
      category: "Electronics",
      variants: [
        { sku: "96765-B", color: "Black", size: "1z", price: 35.99, stock: 2 }
      ],
      reviews: [
        { userId: fakeUserId2, rating: 4, comment: "Good for outdoors" },
        { userId: fakeUserId3, rating: 3.5, comment: "Decent quality" }
      ],
      avgRating: 3.75
    },
    {
      name: "Smart Blender",
      category: "Appliances",
      variants: [
        { sku: "BL-SLV-001", color: "Silver", price: 89.99, stock: 20 }
      ],
      reviews: [],
      avgRating: null
    }
  ]);

  console.log("Database seeded successfully!");
}
