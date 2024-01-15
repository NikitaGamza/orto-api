import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderList: { type: Array, required: false, unique: false },
    clientFIO: { type: String, required: false, unique: false },
    clientAddress: { type: String, required: false, unique: false },
    clientCity: { type: String, required: false, unique: false },
    clientCountry: { type: String, required: false, unique: false },
    clientPostalCode: { type: String, required: false, unique: false },
    clientEmail: { type: String, required: false, unique: false },
    clientPhone: { type: String, required: false, unique: false },
    isTaken: { type: Boolean, required: false, unique: false },
    isDone: { type: Boolean, required: false, unique: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
