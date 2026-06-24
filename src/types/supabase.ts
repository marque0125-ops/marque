export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ProductRow = {
  id: string
  brand_id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  sku: string | null
  weight_grams: number | null
  scale: string | null
  terrain_type: string | null
  is_featured: boolean
  is_active: boolean
  speed_kmh: number | null
  build_type: string | null
  battery_addon_price: number | null
  images: string[]
  video_url: string | null
  whats_in_the_box: string[]
  specs: Json
  compatible_parts: Json
  variants: Json
  stock_qty: number
  average_rating: number
  review_count: number
  created_at: string
}

export type CategoryRow = {
  id: string
  name: string
  image: string
}

export type ProfileRow = {
  id: string
  name: string
  phone: string
  address_line: string | null
  city: string | null
  state: string | null
  pincode: string | null
  gstin: string | null
  is_admin: boolean
  wishlist: Json
  updated_at: string
}

export type OrderRow = {
  id: string
  items: Json
  subtotal: number
  gst_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  status: string
  payment_status: string
  payment_method: string
  payment_id: string | null
  advance_paid_amount: number | null
  tracking_number: string | null
  shipping_address: Json
  logs: Json
  created_at: string
}

export type ProductInsert = {
  id?: string
  brand_id?: string
  category_id?: string
  name?: string
  slug?: string
  description?: string | null
  price?: number
  compare_price?: number | null
  sku?: string | null
  weight_grams?: number | null
  scale?: string | null
  terrain_type?: string | null
  is_featured?: boolean
  is_active?: boolean
  speed_kmh?: number | null
  build_type?: string | null
  battery_addon_price?: number | null
  images?: string[]
  video_url?: string | null
  whats_in_the_box?: string[]
  specs?: Json
  compatible_parts?: Json
  variants?: Json
  stock_qty?: number
  average_rating?: number
  review_count?: number
  created_at?: string
}

export type CategoryInsert = {
  id?: string
  name?: string
  image?: string
}

export type ProfileInsert = {
  id?: string
  name?: string
  phone?: string
  address_line?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  gstin?: string | null
  is_admin?: boolean
  wishlist?: Json
  updated_at?: string
}

export type OrderInsert = {
  id?: string
  items?: Json
  subtotal?: number
  gst_amount?: number
  shipping_amount?: number
  discount_amount?: number
  total_amount?: number
  status?: string
  payment_status?: string
  payment_method?: string
  payment_id?: string | null
  advance_paid_amount?: number | null
  tracking_number?: string | null
  shipping_address?: Json
  logs?: Json
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: ProductInsert
        Update: ProductInsert
      }
      categories: {
        Row: CategoryRow
        Insert: CategoryInsert
        Update: CategoryInsert
      }
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileInsert
      }
      orders: {
        Row: OrderRow
        Insert: OrderInsert
        Update: OrderInsert
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
