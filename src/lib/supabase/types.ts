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
      workspaces: {
        Row: {
          id: string
          name: string
          subscription_tier: 'professional' | 'agency'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subscription_tier?: 'professional' | 'agency'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription_tier?: 'professional' | 'agency'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          workspace_id: string | null
          role: 'admin' | 'member'
          daily_call_target: number
          daily_cv_target: number
          daily_interview_target: number
          placement_goal_period: 'month' | 'quarter' | 'year'
          placement_goal_target: number
          contract_calculation_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          workspace_id?: string | null
          role?: 'admin' | 'member'
          daily_call_target?: number
          daily_cv_target?: number
          daily_interview_target?: number
          placement_goal_period?: 'month' | 'quarter' | 'year'
          placement_goal_target?: number
          contract_calculation_method?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          workspace_id?: string | null
          role?: 'admin' | 'member'
          daily_call_target?: number
          daily_cv_target?: number
          daily_interview_target?: number
          placement_goal_period?: 'month' | 'quarter' | 'year'
          placement_goal_target?: number
          contract_calculation_method?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      clients: {
        Row: {
          id: string
          workspace_id: string
          company_name: string
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          client_type: 'PSL' | 'Preferred' | 'New' | 'Dormant' | null
          response_time_days: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          company_name: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          client_type?: 'PSL' | 'Preferred' | 'New' | 'Dormant' | null
          response_time_days?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          company_name?: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          client_type?: 'PSL' | 'Preferred' | 'New' | 'Dormant' | null
          response_time_days?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: string
          workspace_id: string
          client_id: string | null
          owner_id: string | null
          job_title: string
          job_reference: string | null
          company_name: string | null
          salary_min: number | null
          salary_max: number | null
          fee_percentage: number
          fee_amount: number | null
          status: string
          urgency: string
          job_type: string | null
          contract_day_rate: number | null
          location: string | null
          stage: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          client_id?: string | null
          owner_id?: string | null
          job_title: string
          job_reference?: string | null
          company_name?: string | null
          salary_min?: number | null
          salary_max?: number | null
          fee_percentage?: number
          fee_amount?: number | null
          status?: string
          urgency?: string
          job_type?: string | null
          contract_day_rate?: number | null
          location?: string | null
          stage?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          client_id?: string | null
          owner_id?: string | null
          job_title?: string
          job_reference?: string | null
          company_name?: string | null
          salary_min?: number | null
          salary_max?: number | null
          fee_percentage?: number
          fee_amount?: number | null
          status?: string
          urgency?: string
          job_type?: string | null
          contract_day_rate?: number | null
          location?: string | null
          stage?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      candidates: {
        Row: {
          id: string
          workspace_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          linkedin_url: string | null
          current_company: string | null
          current_role: string | null
          current_salary: number | null
          notice_period: string | null
          location: string | null
          availability: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          current_company?: string | null
          current_role?: string | null
          current_salary?: number | null
          notice_period?: string | null
          location?: string | null
          availability?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          current_company?: string | null
          current_role?: string | null
          current_salary?: number | null
          notice_period?: string | null
          location?: string | null
          availability?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      pipeline_stages: {
        Row: {
          id: string
          workspace_id: string
          role_id: string
          candidate_id: string
          stage: string
          stage_order: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          role_id: string
          candidate_id: string
          stage: string
          stage_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          role_id?: string
          candidate_id?: string
          stage?: string
          stage_order?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_stages_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_stages_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          }
        ]
      }
      activities: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          activity_type: string
          entity_type: string
          entity_id: string
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          activity_type: string
          entity_type: string
          entity_id: string
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          activity_type?: string
          entity_type?: string
          entity_id?: string
          description?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          priority: string
          status: string
          entity_type: string | null
          entity_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          priority?: string
          status?: string
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          priority?: string
          status?: string
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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