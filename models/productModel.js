import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    image: { type: Array, unique: false },
    name: { type: String, required: false, unique: false },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId },
    articul: { type: String, required: true, unique: false },
    color: { type: Array, required: false, unique: false },
    length: { type: Array, required: false, unique: false },
    prices: { type: Array, required: true, unique: false },
    brand: { type: String, required: true, unique: false },
    country: { type: String, required: true, unique: false },
    rating: { type: Number, required: false, unique: false },
    numReviews: { type: Number, required: false, unique: false },
    description: { type: String, required: true, unique: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
