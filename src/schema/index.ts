import { z } from 'zod';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featured?: boolean;
}
export interface PaymentTransaction {
  _id?: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  customerEmail: string;
  customerName: string;
  productId: number;
  productName: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailRecord {
  _id?: string;
  email: string;
  customerName: string;
  orderNumber: string;
  emailType: 'confirmation' | 'receipt' | 'notification';
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
  retryCount: number;
}

export interface OrderDetails {
  _id?: string;
  orderNumber: string;
  productId: number;
  productName: string;
  productCategory: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  status: 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  sharedOnSocial: boolean;
  socialShares: {
    platform: string;
    sharedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}


export const ProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  category: z.string(),
  featured: z.boolean().optional()
});

const emailSchema = z.string().email().or(z.string().min(1).refine(
  val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  "Invalid email"
));

export const CheckoutSchema = z.object({
  productId: z.string().min(1),
  customerEmail: emailSchema,
  customerName: z.string().min(1)
});

export const PaymentDetailsSchema = z.object({
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
}).refine(data => {
  // Additional validation for Razorpay signature format
  return /^[a-f0-9]+$/.test(data.razorpay_signature);
}, {
  message: "Invalid signature format",
  path: ["razorpay_signature"]
});

export const OrderConfirmSchema = z.object({
  customerName: z.string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s\-']+$/, "Name contains invalid characters"),
  
  customerEmail: z.string()
    .email("Valid email is required")
    .max(100, "Email cannot exceed 100 characters"),
    
  productId: z.string()
    .min(1, "Product ID is required")
    .regex(/^[a-f0-9]{24}$/, "Invalid product ID format"), // Assuming MongoDB ObjectId
    
  paymentDetails: PaymentDetailsSchema,

  amount: z.number()
    .min(0, "Amount must be a positive number"),
});

export const ContactSchema = z.object({
  message: z.string().min(1),
  customerEmail: emailSchema,
  customerName: z.string().min(1)
});
export const ShareSchema = z.object({
  orderNumber: z.string().min(1),
  platform: z.string().min(1)
});

export const EmailRecordSchema = z.object({
  email: z.string().email(),
  customerName: z.string(),
  orderNumber: z.string(),
  emailType: z.enum(['confirmation', 'receipt', 'notification']),
  status: z.enum(['sent', 'failed', 'pending']),
  retryCount: z.number().int().min(0)
});

export const PaymentTransactionSchema = z.object({
  orderId: z.string(),
  orderNumber: z.string(),
  amount: z.number(),
  currency: z.string(),
  paymentMethod: z.string(),
  status: z.enum(['pending', 'completed', 'failed']),
  customerEmail: z.string().email(),
  customerName: z.string(),
  productId: z.number(),
  productName: z.string(),
  transactionId: z.string()
});