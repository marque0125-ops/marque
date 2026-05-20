export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
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
        Insert: {
          id: string
          brand_id: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_price?: number | null
          sku?: string | null
          weight_grams?: number | null
          scale?: string | null
          terrain_type?: string | null
          is_featured?: boolean
          is_active?: boolean
          speed_kmh?: number | null
          build_type?: string | null
          images: string[]
          video_url?: string | null
          whats_in_the_box: string[]
          specs?: Json
          compatible_parts?: Json
          variants?: Json
          stock_qty?: number
          average_rating?: number
          review_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          name: string
          phone: string
          address_line: string | null
          city: string | null
          state: string | null
          pincode: string | null
          gstin: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          address_line?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          gstin?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      orders: {
        Row: {
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
          tracking_number: string | null
          shipping_address: Json
          logs: Json
          created_at: string
        }
        Insert: {
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
          payment_id?: string | null
          tracking_number?: string | null
          shipping_address: Json
          logs: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
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
