import mongoose from "mongoose";

// --- Nested Schema: Variant ---
const variantSchema = new mongoose.Schema({
  sku:   { type: String, required: true },
  color: { type: String, required: true },
  size:  { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }
});

// --- Nested Schema: Review ---
const reviewSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, required: true },
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

// --- Main Product Schema ---
const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true },
  variants: [variantSchema],
  reviews:  [reviewSchema],
  avgRating: { type: Number, default: null }
}, { timestamps: true });

// --- Indexes for performance ---
productSchema.index({ category: 1 });
productSchema.index({ "variants.sku": 1 });
productSchema.index({ avgRating: -1 });

// --- Method: update stock for a variant by SKU ---
productSchema.methods.updateStock = async function (sku, quantity) {
  const variant = this.variants.find(v => v.sku === sku);
  if (!variant) throw new Error(`SKU ${sku} not found`);
  if (variant.stock + quantity < 0) throw new Error("Insufficient stock");
  variant.stock += quantity;
  await this.save();
  return variant;
};

// --- Method: recalculate avgRating after new review ---
productSchema.methods.recalcAvgRating = async function () {
  if (this.reviews.length === 0) {
    this.avgRating = null;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.avgRating = parseFloat((total / this.reviews.length).toFixed(2));
  }
  await this.save();
};

const Product = mongoose.model("Product", productSchema);
export default Product;
