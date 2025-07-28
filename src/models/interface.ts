import mongoose from "mongoose";

// interfaces.ts
export interface SocialShare {
  platform: string;
  sharedAt: Date;
}

export interface OrderDetails {
  orderId: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  productCategory: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  status: 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  sharedOnSocial: boolean;
  socialShares: SocialShare[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  isActive?: boolean; // Added for product status
  sku?: string; // Added for product identification
}