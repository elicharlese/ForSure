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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          bio?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          owner_id: string
          status: 'active' | 'completed' | 'archived'
          collaborators: string[]
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          owner_id: string
          status?: 'active' | 'completed' | 'archived'
          collaborators?: string[]
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          owner_id?: string
          status?: 'active' | 'completed' | 'archived'
          collaborators?: string[]
          metadata?: Json | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          excerpt: string
          author_id: string
          published: boolean
          slug: string
          tags: string[]
          featured_image: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          excerpt: string
          author_id: string
          published?: boolean
          slug: string
          tags?: string[]
          featured_image?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          excerpt?: string
          author_id?: string
          published?: boolean
          slug?: string
          tags?: string[]
          featured_image?: string | null
        }
      }
      careers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          requirements: string[]
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          department: string
          salary_range: string | null
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          requirements?: string[]
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'internship'
          department: string
          salary_range?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          requirements?: string[]
          location?: string
          type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          department?: string
          salary_range?: string | null
          active?: boolean
        }
      }
      templates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          category: string
          code: string
          downloads: number
          author_id: string
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          category: string
          code: string
          downloads?: number
          author_id: string
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          category?: string
          code?: string
          downloads?: number
          author_id?: string
          featured?: boolean
        }
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
  }
}
