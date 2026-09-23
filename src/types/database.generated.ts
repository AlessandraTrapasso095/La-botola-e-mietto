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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          company: string | null
          country_code: string
          created_at: string
          deleted_at: string | null
          first_name: string
          id: string
          is_default_billing: boolean
          is_default_shipping: boolean
          label: string
          last_name: string
          line2: string | null
          phone: string
          postal_code: string
          profile_id: string
          province: string | null
          street: string
          street_number: string
          type: Database["public"]["Enums"]["address_type"]
          updated_at: string
        }
        Insert: {
          city: string
          company?: string | null
          country_code?: string
          created_at?: string
          deleted_at?: string | null
          first_name: string
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string
          last_name?: string
          line2?: string | null
          phone?: string
          postal_code: string
          profile_id: string
          province?: string | null
          street: string
          street_number?: string
          type: Database["public"]["Enums"]["address_type"]
          updated_at?: string
        }
        Update: {
          city?: string
          company?: string | null
          country_code?: string
          created_at?: string
          deleted_at?: string | null
          first_name?: string
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string
          last_name?: string
          line2?: string | null
          phone?: string
          postal_code?: string
          profile_id?: string
          province?: string | null
          street?: string
          street_number?: string
          type?: Database["public"]["Enums"]["address_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          country: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          product_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          profile_id: string | null
          session_key: string | null
          status: Database["public"]["Enums"]["cart_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          profile_id?: string | null
          session_key?: string | null
          status?: Database["public"]["Enums"]["cart_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          profile_id?: string | null
          session_key?: string | null
          status?: Database["public"]["Enums"]["cart_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          anonymous_id: string | null
          created_at: string
          granted: boolean
          id: string
          metadata: Json
          policy_version: string
          profile_id: string | null
          revoked_at: string | null
          source: string
          type: Database["public"]["Enums"]["consent_type"]
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          granted: boolean
          id?: string
          metadata?: Json
          policy_version: string
          profile_id?: string | null
          revoked_at?: string | null
          source: string
          type: Database["public"]["Enums"]["consent_type"]
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          granted?: boolean
          id?: string
          metadata?: Json
          policy_version?: string
          profile_id?: string | null
          revoked_at?: string | null
          source?: string
          type?: Database["public"]["Enums"]["consent_type"]
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_deliveries: {
        Row: {
          attempt_count: number
          created_at: string
          event_key: string
          event_type: string
          failed_at: string | null
          id: string
          last_error: string | null
          metadata: Json
          provider_message_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          template_key: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          event_key: string
          event_type: string
          failed_at?: string | null
          id?: string
          last_error?: string | null
          metadata?: Json
          provider_message_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          template_key: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          event_key?: string
          event_type?: string
          failed_at?: string | null
          id?: string
          last_error?: string | null
          metadata?: Json
          provider_message_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_marketing_campaigns: {
        Row: {
          audience_mode: string
          campaign_key: string
          completed_at: string | null
          content: string
          created_at: string
          cta_href: string | null
          cta_label: string | null
          duplicate_count: number
          eligible_count: number
          failed_count: number
          id: string
          intro: string
          selected_profile_ids: string[] | null
          sent_count: number
          started_at: string | null
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          audience_mode: string
          campaign_key: string
          completed_at?: string | null
          content: string
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          duplicate_count?: number
          eligible_count?: number
          failed_count?: number
          id?: string
          intro: string
          selected_profile_ids?: string[] | null
          sent_count?: number
          started_at?: string | null
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          audience_mode?: string
          campaign_key?: string
          completed_at?: string | null
          content?: string
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          duplicate_count?: number
          eligible_count?: number
          failed_count?: number
          id?: string
          intro?: string
          selected_profile_ids?: string[] | null
          sent_count?: number
          started_at?: string | null
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available_quantity: number | null
          product_id: string
          reserved_quantity: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          available_quantity?: number | null
          product_id: string
          reserved_quantity?: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          available_quantity?: number | null
          product_id?: string
          reserved_quantity?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          note: string | null
          order_id: string | null
          product_id: string
          reserved_after: number
          reserved_before: number
          reserved_delta: number
          stock_after: number
          stock_before: number
          stock_delta: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: string
          note?: string | null
          order_id?: string | null
          product_id: string
          reserved_after: number
          reserved_before: number
          reserved_delta?: number
          stock_after: number
          stock_before: number
          stock_delta?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: string
          note?: string | null
          order_id?: string | null
          product_id?: string
          reserved_after?: number
          reserved_before?: number
          reserved_delta?: number
          stock_after?: number
          stock_before?: number
          stock_delta?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean
          product_id: string
          promotional_net_amount_minor: number | null
          starts_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          promotional_net_amount_minor?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          promotional_net_amount_minor?: number | null
          starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "offers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_gross_amount_minor: number
          order_id: string
          product_code: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_gross_amount_minor: number
          unit_net_amount_minor: number
          vat_rate_basis_points: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_gross_amount_minor: number
          order_id: string
          product_code: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_gross_amount_minor: number
          unit_net_amount_minor: number
          vat_rate_basis_points: number
        }
        Update: {
          created_at?: string
          id?: string
          line_gross_amount_minor?: number
          order_id?: string
          product_code?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_gross_amount_minor?: number
          unit_net_amount_minor?: number
          vat_rate_basis_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          cancellation_request_resolved_at: string | null
          cancellation_request_status:
            | Database["public"]["Enums"]["order_cancellation_request_status"]
            | null
          cancellation_requested_at: string | null
          cancellation_resolution_note: string | null
          cancelled_at: string | null
          created_at: string
          currency: string
          customer_cancellation_note: string | null
          delivered_at: string | null
          discount_gross_amount_minor: number
          discount_net_amount_minor: number
          discount_vat_amount_minor: number
          hidden_from_customer_at: string | null
          id: string
          inventory_committed_at: string | null
          order_number: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          profile_id: string
          promotion_code: string | null
          promotion_code_id: string | null
          promotion_discount_type: string | null
          promotion_discount_value: number | null
          refund_amount_minor: number | null
          refund_provider: string | null
          refund_reference: string | null
          refunded_at: string | null
          reservation_released_at: string | null
          shipped_at: string | null
          shipping_address: Json
          shipping_carrier: string | null
          shipping_gross_amount_minor: number
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          source_cart_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          subtotal_net_amount_minor: number
          total_gross_amount_minor: number
          tracking_code: string | null
          tracking_url: string | null
          updated_at: string
          vat_amount_minor: number
        }
        Insert: {
          billing_address: Json
          cancellation_request_resolved_at?: string | null
          cancellation_request_status?:
            | Database["public"]["Enums"]["order_cancellation_request_status"]
            | null
          cancellation_requested_at?: string | null
          cancellation_resolution_note?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          customer_cancellation_note?: string | null
          delivered_at?: string | null
          discount_gross_amount_minor?: number
          discount_net_amount_minor?: number
          discount_vat_amount_minor?: number
          hidden_from_customer_at?: string | null
          id?: string
          inventory_committed_at?: string | null
          order_number: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id: string
          promotion_code?: string | null
          promotion_code_id?: string | null
          promotion_discount_type?: string | null
          promotion_discount_value?: number | null
          refund_amount_minor?: number | null
          refund_provider?: string | null
          refund_reference?: string | null
          refunded_at?: string | null
          reservation_released_at?: string | null
          shipped_at?: string | null
          shipping_address: Json
          shipping_carrier?: string | null
          shipping_gross_amount_minor: number
          shipping_method?: Database["public"]["Enums"]["shipping_method"]
          source_cart_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_net_amount_minor: number
          total_gross_amount_minor: number
          tracking_code?: string | null
          tracking_url?: string | null
          updated_at?: string
          vat_amount_minor: number
        }
        Update: {
          billing_address?: Json
          cancellation_request_resolved_at?: string | null
          cancellation_request_status?:
            | Database["public"]["Enums"]["order_cancellation_request_status"]
            | null
          cancellation_requested_at?: string | null
          cancellation_resolution_note?: string | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          customer_cancellation_note?: string | null
          delivered_at?: string | null
          discount_gross_amount_minor?: number
          discount_net_amount_minor?: number
          discount_vat_amount_minor?: number
          hidden_from_customer_at?: string | null
          id?: string
          inventory_committed_at?: string | null
          order_number?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_provider_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string
          promotion_code?: string | null
          promotion_code_id?: string | null
          promotion_discount_type?: string | null
          promotion_discount_value?: number | null
          refund_amount_minor?: number | null
          refund_provider?: string | null
          refund_reference?: string | null
          refunded_at?: string | null
          reservation_released_at?: string | null
          shipped_at?: string | null
          shipping_address?: Json
          shipping_carrier?: string | null
          shipping_gross_amount_minor?: number
          shipping_method?: Database["public"]["Enums"]["shipping_method"]
          source_cart_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          subtotal_net_amount_minor?: number
          total_gross_amount_minor?: number
          tracking_code?: string | null
          tracking_url?: string | null
          updated_at?: string
          vat_amount_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promotion_code_id_fkey"
            columns: ["promotion_code_id"]
            isOneToOne: false
            referencedRelation: "promotion_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_source_cart_id_fkey"
            columns: ["source_cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          created_at: string
          currency: string
          id: string
          net_amount_minor: number
          product_id: string
          valid_from: string
          valid_to: string | null
          vat_rate_basis_points: number
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          net_amount_minor: number
          product_id: string
          valid_from?: string
          valid_to?: string | null
          vat_rate_basis_points: number
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          net_amount_minor?: number
          product_id?: string
          valid_from?: string
          valid_to?: string | null
          vat_rate_basis_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string
          created_at: string
          height: number
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string
          thumbnail_path: string | null
          updated_at: string
          width: number
        }
        Insert: {
          alt_text?: string
          created_at?: string
          height: number
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path: string
          thumbnail_path?: string | null
          updated_at?: string
          width: number
        }
        Update: {
          alt_text?: string
          created_at?: string
          height?: number
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string
          thumbnail_path?: string | null
          updated_at?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alcohol_percentage: number | null
          brand_id: string | null
          capacity_label: string
          capacity_ml: number | null
          characteristics: string | null
          category_id: string
          code: string
          country: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_limited: boolean
          is_new: boolean
          name: string
          origin: string | null
          pack_quantity: number | null
          producer: string | null
          search_document: unknown
          service_notes: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          subcategory_id: string | null
          tasting_notes: string | null
          updated_at: string
        }
        Insert: {
          alcohol_percentage?: number | null
          brand_id?: string | null
          capacity_label: string
          capacity_ml?: number | null
          characteristics?: string | null
          category_id: string
          code: string
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_limited?: boolean
          is_new?: boolean
          name: string
          origin?: string | null
          pack_quantity?: number | null
          producer?: string | null
          search_document?: unknown
          service_notes?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          subcategory_id?: string | null
          tasting_notes?: string | null
          updated_at?: string
        }
        Update: {
          alcohol_percentage?: number | null
          brand_id?: string | null
          capacity_label?: string
          capacity_ml?: number | null
          characteristics?: string | null
          category_id?: string
          code?: string
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_limited?: boolean
          is_new?: boolean
          name?: string
          origin?: string | null
          pack_quantity?: number | null
          producer?: string | null
          search_document?: unknown
          service_notes?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          subcategory_id?: string | null
          tasting_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "catalog_brands_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_categories_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_notify_cancellations: boolean
          admin_notify_new_orders: boolean
          admin_notify_payments: boolean
          admin_notify_shipping: boolean
          birth_date: string | null
          created_at: string
          deleted_at: string | null
          email: string
          email_updates: boolean
          first_name: string
          id: string
          last_name: string
          marketing_consent: boolean
          phone: string | null
          role: Database["public"]["Enums"]["account_role"]
          updated_at: string
        }
        Insert: {
          admin_notify_cancellations?: boolean
          admin_notify_new_orders?: boolean
          admin_notify_payments?: boolean
          admin_notify_shipping?: boolean
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          email_updates?: boolean
          first_name?: string
          id: string
          last_name?: string
          marketing_consent?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["account_role"]
          updated_at?: string
        }
        Update: {
          admin_notify_cancellations?: boolean
          admin_notify_new_orders?: boolean
          admin_notify_payments?: boolean
          admin_notify_shipping?: boolean
          birth_date?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_updates?: boolean
          first_name?: string
          id?: string
          last_name?: string
          marketing_consent?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["account_role"]
          updated_at?: string
        }
        Relationships: []
      }
      promotion_codes: {
        Row: {
          code: string
          created_at: string
          currency: string
          description: string | null
          discount_type: string
          discount_value: number
          ends_at: string | null
          id: string
          is_active: boolean
          minimum_order_gross_amount_minor: number
          starts_at: string | null
          stripe_coupon_id: string | null
          stripe_promotion_code_id: string | null
          updated_at: string
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_type: string
          discount_value: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          minimum_order_gross_amount_minor?: number
          starts_at?: string | null
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          ends_at?: string | null
          id?: string
          is_active?: boolean
          minimum_order_gross_amount_minor?: number
          starts_at?: string | null
          stripe_coupon_id?: string | null
          stripe_promotion_code_id?: string | null
          updated_at?: string
          usage_limit?: number | null
        }
        Relationships: []
      }
      rate_limit_buckets: {
        Row: {
          identifier_hash: string
          request_count: number
          scope: string
          updated_at: string
          window_started_at: string
        }
        Insert: {
          identifier_hash: string
          request_count: number
          scope: string
          updated_at?: string
          window_started_at: string
        }
        Update: {
          identifier_hash?: string
          request_count?: number
          scope?: string
          updated_at?: string
          window_started_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          product_id: string
          wishlist_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          wishlist_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_projection"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_source_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "catalog_products_view"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      catalog_brands_view: {
        Row: {
          brand_id: string | null
          country: string | null
          description: string | null
          name: string | null
          product_count: number | null
          search_text: string | null
          slug: string | null
        }
        Relationships: []
      }
      catalog_categories_view: {
        Row: {
          category_id: string | null
          description: string | null
          name: string | null
          product_count: number | null
          search_text: string | null
          slug: string | null
          sort_order: number | null
          subcategories: string[] | null
        }
        Relationships: []
      }
      catalog_products_projection: {
        Row: {
          alcohol_percentage: number | null
          available_quantity: number | null
          brand_country: string | null
          brand_id: string | null
          brand_name: string | null
          brand_slug: string | null
          capacity_label: string | null
          capacity_ml: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          code: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          effective_net_amount_minor: number | null
          gross_amount_minor: number | null
          image_alt_text: string | null
          image_height: number | null
          image_path: string | null
          image_width: number | null
          is_limited: boolean | null
          is_new: boolean | null
          name: string | null
          offer_id: string | null
          origin: string | null
          pack_quantity: number | null
          previous_gross_amount_minor: number | null
          producer: string | null
          product_id: string | null
          promotional_net_amount_minor: number | null
          regular_net_amount_minor: number | null
          reserved_quantity: number | null
          search_text: string | null
          service_notes: string | null
          slug: string | null
          stock_quantity: number | null
          subcategory_id: string | null
          subcategory_name: string | null
          subcategory_slug: string | null
          tasting_notes: string | null
          thumbnail_path: string | null
          updated_at: string | null
          vat_rate_basis_points: number | null
        }
        Relationships: []
      }
      catalog_products_source_view: {
        Row: {
          alcohol_percentage: number | null
          available_quantity: number | null
          brand_country: string | null
          brand_id: string | null
          brand_name: string | null
          brand_slug: string | null
          capacity_label: string | null
          capacity_ml: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          code: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          effective_net_amount_minor: number | null
          gross_amount_minor: number | null
          image_alt_text: string | null
          image_height: number | null
          image_path: string | null
          image_width: number | null
          is_limited: boolean | null
          is_new: boolean | null
          name: string | null
          offer_id: string | null
          origin: string | null
          pack_quantity: number | null
          previous_gross_amount_minor: number | null
          producer: string | null
          product_id: string | null
          promotional_net_amount_minor: number | null
          regular_net_amount_minor: number | null
          reserved_quantity: number | null
          search_text: string | null
          service_notes: string | null
          slug: string | null
          stock_quantity: number | null
          subcategory_id: string | null
          subcategory_name: string | null
          subcategory_slug: string | null
          tasting_notes: string | null
          thumbnail_path: string | null
          updated_at: string | null
          vat_rate_basis_points: number | null
        }
        Relationships: []
      }
      catalog_products_view: {
        Row: {
          alcohol_percentage: number | null
          available_quantity: number | null
          brand_country: string | null
          brand_id: string | null
          brand_name: string | null
          brand_slug: string | null
          capacity_label: string | null
          capacity_ml: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          code: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          effective_net_amount_minor: number | null
          gross_amount_minor: number | null
          image_alt_text: string | null
          image_height: number | null
          image_path: string | null
          image_width: number | null
          is_limited: boolean | null
          is_new: boolean | null
          name: string | null
          offer_id: string | null
          origin: string | null
          pack_quantity: number | null
          previous_gross_amount_minor: number | null
          producer: string | null
          product_id: string | null
          promotional_net_amount_minor: number | null
          regular_net_amount_minor: number | null
          reserved_quantity: number | null
          search_text: string | null
          service_notes: string | null
          slug: string | null
          stock_quantity: number | null
          subcategory_id: string | null
          subcategory_name: string | null
          subcategory_slug: string | null
          tasting_notes: string | null
          thumbnail_path: string | null
          updated_at: string | null
          vat_rate_basis_points: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      account_cart_lines: {
        Args: never
        Returns: {
          quantity: number
          slug: string
        }[]
      }
      account_wishlist_slugs: {
        Args: never
        Returns: {
          slug: string
        }[]
      }
      add_account_cart_item: {
        Args: { product_slug: string; requested_quantity?: number }
        Returns: {
          quantity: number
          slug: string
        }[]
      }
      admin_create_product: {
        Args: {
          p_alcohol_percentage: number
          p_brand_id: string
          p_capacity_label: string
          p_capacity_ml: number
          p_category_id: string
          p_code: string
          p_country: string
          p_description: string
          p_is_limited: boolean
          p_is_new: boolean
          p_name: string
          p_net_amount_minor: number
          p_origin: string
          p_pack_quantity: number
          p_producer: string
          p_service_notes: string
          p_slug: string
          p_subcategory_id: string
          p_tasting_notes: string
          p_vat_rate_basis_points: number
        }
        Returns: string
      }
      admin_deactivate_product_offer: {
        Args: { p_product_id: string }
        Returns: string
      }
      admin_delete_brand: { Args: { p_brand_id: string }; Returns: undefined }
      admin_delete_category: {
        Args: { p_category_id: string }
        Returns: undefined
      }
      admin_delete_product_image: {
        Args: { p_product_id: string }
        Returns: {
          image_id: string
          storage_path: string
          thumbnail_path: string
        }[]
      }
      admin_register_product_image: {
        Args: {
          p_alt_text: string
          p_height: number
          p_product_id: string
          p_storage_path: string
          p_width: number
        }
        Returns: string
      }
      admin_replace_product_image: {
        Args: {
          p_alt_text: string
          p_height: number
          p_product_id: string
          p_storage_path: string
          p_width: number
        }
        Returns: {
          image_id: string
          previous_storage_path: string
          previous_thumbnail_path: string
        }[]
      }
      admin_replace_product_image_with_thumbnail: {
        Args: {
          p_alt_text: string
          p_height: number
          p_product_id: string
          p_storage_path: string
          p_thumbnail_path: string
          p_width: number
        }
        Returns: {
          image_id: string
          previous_storage_path: string
          previous_thumbnail_path: string
        }[]
      }
      admin_set_product_offer: {
        Args: { p_discount_percentage: number; p_product_id: string }
        Returns: string
      }
      admin_set_product_status: {
        Args: {
          p_product_id: string
          p_status: Database["public"]["Enums"]["product_status"]
        }
        Returns: {
          product_id: string
          product_status: Database["public"]["Enums"]["product_status"]
        }[]
      }
      admin_set_product_stock: {
        Args: {
          p_created_by: string
          p_note: string
          p_product_id: string
          p_stock_quantity: number
        }
        Returns: {
          available_quantity: number
          movement_id: string
          product_id: string
          reserved_quantity: number
          stock_quantity: number
        }[]
      }
      admin_update_product: {
        Args: {
          p_alcohol_percentage: number
          p_brand_id: string
          p_capacity_label: string
          p_capacity_ml: number
          p_category_id: string
          p_code: string
          p_country: string
          p_description: string
          p_is_limited: boolean
          p_is_new: boolean
          p_name: string
          p_net_amount_minor: number
          p_origin: string
          p_pack_quantity: number
          p_producer: string
          p_product_id: string
          p_service_notes: string
          p_slug: string
          p_subcategory_id: string
          p_tasting_notes: string
          p_vat_rate_basis_points: number
        }
        Returns: undefined
      }
      admin_upsert_brand: {
        Args: {
          p_country: string
          p_description: string
          p_id: string
          p_name: string
          p_slug: string
          p_status: Database["public"]["Enums"]["product_status"]
        }
        Returns: string
      }
      admin_upsert_category: {
        Args: {
          p_description: string
          p_id: string
          p_name: string
          p_parent_id: string
          p_slug: string
          p_sort_order: number
          p_status: Database["public"]["Enums"]["product_status"]
        }
        Returns: string
      }
      cancel_account_order: { Args: { p_order_id: string }; Returns: string }
      cancel_admin_received_order: {
        Args: {
          p_customer_note: string
          p_order_id: string
          p_refund_amount_minor?: number
          p_refund_provider?: string
          p_refund_reference?: string
        }
        Returns: string
      }
      catalog_filter_options: {
        Args: {
          brand_slug?: string
          category_slug?: string
          only_offers?: boolean
          product_slugs?: string[]
          subcategory_slug?: string
        }
        Returns: {
          kind: string
          label: string
          value: string
        }[]
      }
      checkout_account_cart: {
        Args: {
          p_billing_address_id: string
          p_payment_method: Database["public"]["Enums"]["payment_method"]
          p_promotion_code?: string
          p_shipping_address_id: string
          p_shipping_method: Database["public"]["Enums"]["shipping_method"]
        }
        Returns: {
          created_at: string
          discount_gross_amount_minor: number
          order_id: string
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          promotion_code: string
          shipping_gross_amount_minor: number
          shipping_method: Database["public"]["Enums"]["shipping_method"]
          subtotal_net_amount_minor: number
          total_gross_amount_minor: number
          vat_amount_minor: number
        }[]
      }
      complete_stripe_order_payment: {
        Args: {
          p_checkout_session_id: string
          p_order_id: string
          p_payment_intent_id: string
        }
        Returns: boolean
      }
      confirm_admin_bank_transfer: {
        Args: { p_order_id: string }
        Returns: {
          order_id: string
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"]
          paid_at: string
          payment_status: Database["public"]["Enums"]["payment_status"]
        }[]
      }
      consume_rate_limit: {
        Args: {
          p_identifier_hash: string
          p_limit: number
          p_scope: string
          p_window_seconds: number
        }
        Returns: {
          allowed: boolean
          remaining: number
          reset_at: string
          retry_after_seconds: number
        }[]
      }
      current_user_is_admin: { Args: never; Returns: boolean }
      delete_account_address: {
        Args: { address_id_value: string }
        Returns: boolean
      }
      ensure_account_cart: { Args: never; Returns: string }
      fail_stripe_order_payment: {
        Args: { p_checkout_session_id: string; p_order_id: string }
        Returns: boolean
      }
      hide_cancelled_account_order: {
        Args: { p_order_id: string }
        Returns: boolean
      }
      merge_account_cart_items: {
        Args: { local_items: Json }
        Returns: {
          quantity: number
          slug: string
        }[]
      }
      merge_account_wishlist: {
        Args: { product_slugs: string[] }
        Returns: {
          slug: string
        }[]
      }
      normalize_catalog_search: { Args: { value: string }; Returns: string }
      remove_account_cart_item: {
        Args: { product_slug: string }
        Returns: {
          quantity: number
          slug: string
        }[]
      }
      remove_account_wishlist_item: {
        Args: { product_slug: string }
        Returns: {
          slug: string
        }[]
      }
      resolve_admin_order_cancellation: {
        Args: {
          p_action: string
          p_order_id: string
          p_refund_amount_minor?: number
          p_refund_provider?: string
          p_refund_reference?: string
          p_resolution_note?: string
        }
        Returns: string
      }
      set_account_cart_item_quantity: {
        Args: { product_slug: string; requested_quantity: number }
        Returns: {
          quantity: number
          slug: string
        }[]
      }
      update_account_preferences: {
        Args: {
          email_updates_value: boolean
          marketing_consent_value: boolean
          policy_version_value: string
        }
        Returns: {
          admin_notify_cancellations: boolean
          admin_notify_new_orders: boolean
          admin_notify_payments: boolean
          admin_notify_shipping: boolean
          birth_date: string | null
          created_at: string
          deleted_at: string | null
          email: string
          email_updates: boolean
          first_name: string
          id: string
          last_name: string
          marketing_consent: boolean
          phone: string | null
          role: Database["public"]["Enums"]["account_role"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      upsert_account_address: {
        Args: {
          address_id_value?: string
          city_value: string
          company_value: string
          country_code_value: string
          first_name_value: string
          is_default_billing_value: boolean
          is_default_shipping_value: boolean
          label_value: string
          last_name_value: string
          line2_value: string
          phone_value: string
          postal_code_value: string
          province_value: string
          street_number_value: string
          street_value: string
          type_value: Database["public"]["Enums"]["address_type"]
        }
        Returns: {
          city: string
          company: string | null
          country_code: string
          created_at: string
          deleted_at: string | null
          first_name: string
          id: string
          is_default_billing: boolean
          is_default_shipping: boolean
          label: string
          last_name: string
          line2: string | null
          phone: string
          postal_code: string
          profile_id: string
          province: string | null
          street: string
          street_number: string
          type: Database["public"]["Enums"]["address_type"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "addresses"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      validate_promotion_code: {
        Args: {
          p_code: string
          p_currency?: string
          p_subtotal_gross_amount_minor: number
        }
        Returns: {
          discount_gross_amount_minor: number
          discount_type: string
          discount_value: number
          minimum_order_gross_amount_minor: number
          promotion_code: string
          promotion_code_id: string
          usage_count: number
          usage_limit: number
        }[]
      }
    }
    Enums: {
      account_role: "customer" | "admin"
      address_type: "shipping" | "billing"
      cart_status: "active" | "converted" | "abandoned"
      consent_type:
        | "age_confirmation"
        | "privacy"
        | "marketing"
        | "cookie_preferences"
        | "terms_of_sale"
      order_cancellation_request_status: "pending" | "approved" | "rejected"
      order_status:
        | "received"
        | "preparing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "stripe" | "bank_transfer" | "satispay"
      payment_status: "pending" | "authorized" | "paid" | "failed" | "refunded"
      product_status: "draft" | "active" | "archived"
      shipping_method: "store_pickup" | "tnt" | "fedex"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      account_role: ["customer", "admin"],
      address_type: ["shipping", "billing"],
      cart_status: ["active", "converted", "abandoned"],
      consent_type: [
        "age_confirmation",
        "privacy",
        "marketing",
        "cookie_preferences",
        "terms_of_sale",
      ],
      order_cancellation_request_status: ["pending", "approved", "rejected"],
      order_status: [
        "received",
        "preparing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["stripe", "bank_transfer", "satispay"],
      payment_status: ["pending", "authorized", "paid", "failed", "refunded"],
      product_status: ["draft", "active", "archived"],
      shipping_method: ["store_pickup", "tnt", "fedex"],
    },
  },
} as const
