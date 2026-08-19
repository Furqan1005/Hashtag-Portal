export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      design_variants: {
        Row: {
          design_id: string
          id: string
          is_default: boolean
          kind: Database["public"]["Enums"]["variant_kind"]
          label: string
          price_modifier: number
          sort_order: number
          weight: number
          weight_unit: string
        }
        Insert: {
          design_id: string
          id?: string
          is_default?: boolean
          kind: Database["public"]["Enums"]["variant_kind"]
          label: string
          price_modifier?: number
          sort_order?: number
          weight?: number
          weight_unit?: string
        }
        Update: {
          design_id?: string
          id?: string
          is_default?: boolean
          kind?: Database["public"]["Enums"]["variant_kind"]
          label?: string
          price_modifier?: number
          sort_order?: number
          weight?: number
          weight_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_variants_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          attribute_tags: string[]
          base_price: number
          base_weight_gms: number
          category: Database["public"]["Enums"]["design_category"]
          created_at: string
          design_type: Database["public"]["Enums"]["design_type"]
          id: string
          image_urls: string[]
          is_new_arrival: boolean
          name: string
          primary_image_url: string | null
          sku: string
        }
        Insert: {
          attribute_tags?: string[]
          base_price?: number
          base_weight_gms?: number
          category: Database["public"]["Enums"]["design_category"]
          created_at?: string
          design_type?: Database["public"]["Enums"]["design_type"]
          id?: string
          image_urls?: string[]
          is_new_arrival?: boolean
          name: string
          primary_image_url?: string | null
          sku: string
        }
        Update: {
          attribute_tags?: string[]
          base_price?: number
          base_weight_gms?: number
          category?: Database["public"]["Enums"]["design_category"]
          created_at?: string
          design_type?: Database["public"]["Enums"]["design_type"]
          id?: string
          image_urls?: string[]
          is_new_arrival?: boolean
          name?: string
          primary_image_url?: string | null
          sku?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          balance_qty: number
          colorstone_variant_id: string | null
          delay_info: string | null
          design_id: string
          design_no: string | null
          diamond_variant_id: string | null
          exported_qty: number
          finished_qty: number
          id: string
          kt_col_label: string | null
          metal_variant_id: string | null
          order_id: string
          ordered_qty: number
          price: number
          quantity: number
          remark: string
          size: string | null
        }
        Insert: {
          balance_qty?: number
          colorstone_variant_id?: string | null
          delay_info?: string | null
          design_id: string
          design_no?: string | null
          diamond_variant_id?: string | null
          exported_qty?: number
          finished_qty?: number
          id?: string
          kt_col_label?: string | null
          metal_variant_id?: string | null
          order_id: string
          ordered_qty?: number
          price?: number
          quantity?: number
          remark?: string
          size?: string | null
        }
        Update: {
          balance_qty?: number
          colorstone_variant_id?: string | null
          delay_info?: string | null
          design_id?: string
          design_no?: string | null
          diamond_variant_id?: string | null
          exported_qty?: number
          finished_qty?: number
          id?: string
          kt_col_label?: string | null
          metal_variant_id?: string | null
          order_id?: string
          ordered_qty?: number
          price?: number
          quantity?: number
          remark?: string
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_colorstone_variant_id_fkey"
            columns: ["colorstone_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_diamond_variant_id_fkey"
            columns: ["diamond_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_metal_variant_id_fkey"
            columns: ["metal_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_id: string | null
          balance_amount: number
          created_at: string
          customer_name: string | null
          exp_date: string | null
          exported_at: string | null
          finished_at: string | null
          id: string
          ordered_at: string
          placed_by: string | null
          po_no: string
          showroom_staff_name: string | null
          status: Database["public"]["Enums"]["order_status"]
          sub_po_no: string | null
          total_amount: number
        }
        Insert: {
          account_id?: string | null
          balance_amount?: number
          created_at?: string
          customer_name?: string | null
          exp_date?: string | null
          exported_at?: string | null
          finished_at?: string | null
          id?: string
          ordered_at?: string
          placed_by?: string | null
          po_no: string
          showroom_staff_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_po_no?: string | null
          total_amount?: number
        }
        Update: {
          account_id?: string | null
          balance_amount?: number
          created_at?: string
          customer_name?: string | null
          exp_date?: string | null
          exported_at?: string | null
          finished_at?: string | null
          id?: string
          ordered_at?: string
          placed_by?: string | null
          po_no?: string
          showroom_staff_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_po_no?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_placed_by_fkey"
            columns: ["placed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_items: {
        Row: {
          colorstone_variant_id: string | null
          design_id: string
          diamond_variant_id: string | null
          id: string
          metal_variant_id: string | null
          presentation_id: string
          remark: string
        }
        Insert: {
          colorstone_variant_id?: string | null
          design_id: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          presentation_id: string
          remark?: string
        }
        Update: {
          colorstone_variant_id?: string | null
          design_id?: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          presentation_id?: string
          remark?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentation_items_colorstone_variant_id_fkey"
            columns: ["colorstone_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentation_items_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentation_items_diamond_variant_id_fkey"
            columns: ["diamond_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentation_items_metal_variant_id_fkey"
            columns: ["metal_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentation_items_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          },
        ]
      }
      presentations: {
        Row: {
          account_id: string | null
          created_at: string
          created_by: string
          id: string
          name: string
          status: Database["public"]["Enums"]["presentation_status"]
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["presentation_status"]
        }
        Update: {
          account_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["presentation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "presentations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presentations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          account_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          colorstone_variant_id: string | null
          design_id: string
          diamond_variant_id: string | null
          id: string
          metal_variant_id: string | null
          price: number
          quantity: number
          quote_id: string
          remark: string
        }
        Insert: {
          colorstone_variant_id?: string | null
          design_id: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          price?: number
          quantity?: number
          quote_id: string
          remark?: string
        }
        Update: {
          colorstone_variant_id?: string | null
          design_id?: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          price?: number
          quantity?: number
          quote_id?: string
          remark?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_colorstone_variant_id_fkey"
            columns: ["colorstone_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_diamond_variant_id_fkey"
            columns: ["diamond_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_metal_variant_id_fkey"
            columns: ["metal_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          account_id: string | null
          created_at: string
          id: string
          notes: string
          requested_by: string
          status: Database["public"]["Enums"]["quote_status"]
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          id?: string
          notes?: string
          requested_by: string
          status?: Database["public"]["Enums"]["quote_status"]
        }
        Update: {
          account_id?: string | null
          created_at?: string
          id?: string
          notes?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["quote_status"]
        }
        Relationships: [
          {
            foreignKeyName: "quotes_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      selection_items: {
        Row: {
          colorstone_variant_id: string | null
          created_at: string
          design_id: string
          diamond_variant_id: string | null
          id: string
          metal_variant_id: string | null
          price: number
          quantity: number
          remark: string
          status: Database["public"]["Enums"]["selection_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          colorstone_variant_id?: string | null
          created_at?: string
          design_id: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          price?: number
          quantity?: number
          remark?: string
          status?: Database["public"]["Enums"]["selection_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          colorstone_variant_id?: string | null
          created_at?: string
          design_id?: string
          diamond_variant_id?: string | null
          id?: string
          metal_variant_id?: string | null
          price?: number
          quantity?: number
          remark?: string
          status?: Database["public"]["Enums"]["selection_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selection_items_colorstone_variant_id_fkey"
            columns: ["colorstone_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_items_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_items_diamond_variant_id_fkey"
            columns: ["diamond_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_items_metal_variant_id_fkey"
            columns: ["metal_variant_id"]
            isOneToOne: false
            referencedRelation: "design_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selection_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      showroom_customers: {
        Row: {
          created_at: string
          created_by_staff_name: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          created_by_staff_name?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          created_by_staff_name?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      showroom_staff: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          pin_hash: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id?: string
          pin_hash: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          pin_hash?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      network_root: { Args: never; Returns: string }
    }
    Enums: {
      design_category:
        | "bangle"
        | "bracelet"
        | "earring"
        | "necklace"
        | "nosepin"
        | "pendant"
        | "ring"
      design_type: "estrella" | "exclusive"
      order_status:
        | "pending"
        | "ready_to_ship"
        | "delayed"
        | "exported"
        | "balance_due"
      presentation_status: "draft" | "sent"
      quote_status: "pending" | "responded" | "closed"
      selection_status: "active" | "saved"
      user_role: "business_owner" | "business_staff" | "showroom_staff"
      variant_kind: "metal" | "diamond_quality" | "colorstone"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      design_category: [
        "bangle",
        "bracelet",
        "earring",
        "necklace",
        "nosepin",
        "pendant",
        "ring",
      ],
      design_type: ["estrella", "exclusive"],
      order_status: [
        "pending",
        "ready_to_ship",
        "delayed",
        "exported",
        "balance_due",
      ],
      presentation_status: ["draft", "sent"],
      quote_status: ["pending", "responded", "closed"],
      selection_status: ["active", "saved"],
      user_role: ["business_owner", "business_staff", "showroom_staff"],
      variant_kind: ["metal", "diamond_quality", "colorstone"],
    },
  },
} as const
