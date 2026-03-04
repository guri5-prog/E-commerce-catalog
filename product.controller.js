import Product from "../models/product.model.js";

// GET /api/products — all products
export async function getAllProducts(req, res) {
  const products = await Product.find();
  res.json(products);
}

// GET /api/products/:id — single product
export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}

// GET /api/products/aggregation/low-stock — products with any variant stock < 5
export async function getLowStockProducts(req, res) {
  const lowStockProducts = await Product.aggregate([
    { $unwind: "$variants" },
    { $match: { "variants.stock": { $lt: 5 } } },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        lowStockVariants: { $push: "$variants" }
      }
    }
  ]);
  res.json({ lowStockProducts });
}

// GET /api/products/aggregation/category-ratings — avg rating per category
export async function getCategoryRatings(req, res) {
  const categoryRatings = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        avgCategoryRating: { $avg: "$avgRating" }
      }
    },
    { $sort: { avgCategoryRating: -1 } }
  ]);
  res.json({ categoryRatings });
}

// PATCH /api/products/:id/stock — update stock for a variant
export async function updateStock(req, res) {
  const { sku, quantity } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  try {
    const updatedVariant = await product.updateStock(sku, quantity);
    res.json({ message: "Stock updated", variant: updatedVariant });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// POST /api/products/:id/reviews — add a review
export async function addReview(req, res) {
  const { userId, rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.reviews.push({ userId, rating, comment });
  await product.recalcAvgRating();

  res.status(201).json({ message: "Review added", avgRating: product.avgRating });
}
