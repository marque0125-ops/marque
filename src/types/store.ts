import { Product, ProductVariant, Review } from "../data/mockData";

export interface CartItem {
  id: string; // unique item id (product.id + '-' + variant.id)
  product: Product;
  variant: ProductVariant;
  qty: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'out-of-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentId?: string;
  trackingNumber: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  logs: { status: string; timestamp: string; message: string }[];
}
