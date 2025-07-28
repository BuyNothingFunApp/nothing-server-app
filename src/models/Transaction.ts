import mongoose from 'mongoose';

const PaymentTransactionSchema = new mongoose.Schema({
  orderId: String,
  orderNumber: String,
  amount: Number,
  currency: String,
  paymentMethod: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  customerEmail: String,
  customerName: String,
  productId: String,
  productName: String,
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const PaymentTransaction = mongoose.model('PaymentTransaction', PaymentTransactionSchema);