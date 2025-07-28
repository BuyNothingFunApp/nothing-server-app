import mongoose from 'mongoose';
import { Product, OrderDetails } from './interface';

const SocialShareSchema = new mongoose.Schema({
  platform: { 
    type: String, 
    required: true,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'whatsapp'] 
  },
  sharedAt: { type: Date, default: Date.now }
});


const OrderDetailsSchema = new mongoose.Schema<OrderDetails>({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `ord_${Math.random().toString(36).substr(2, 9)}`
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { type: String, required: true },
  customerEmail: { 
    type: String, 
    required: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  customerName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'processing', 'completed', 'cancelled'], 
    default: 'confirmed' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  sharedOnSocial: { type: Boolean, default: false },
  socialShares: [SocialShareSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderDetailsSchema.index({ customerEmail: 1 });
OrderDetailsSchema.index({ productId: 1 });
OrderDetailsSchema.index({ status: 1, paymentStatus: 1 });


const ProductSchema = new mongoose.Schema<Product>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    set: (v: number) => Math.round(v * 100) // Store in paise/cents
  },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'clothing', 'books', 'home', 'other']
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

// Text index for search
ProductSchema.index({ name: 'text', description: 'text' });


const EmailRecordSchema = new mongoose.Schema({
  email: String,
  customerName: String,
  orderNumber: String,
  emailType: { type: String, enum: ['confirmation', 'receipt', 'notification'] },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'failed', 'pending'] },
  retryCount: { type: Number, default: 0 }
});

export const EmailRecord = mongoose.model('EmailRecord', EmailRecordSchema);

export const ProductModel = mongoose.model('Product', ProductSchema);
export const OrderModel = mongoose.model('OrderDetails', OrderDetailsSchema);
