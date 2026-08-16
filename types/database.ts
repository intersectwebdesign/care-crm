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
      client_assignments: {
        Row: {
          assigned_at: string
          client_id: string
          contractor_id: string
          id: string
        }
        Insert: {
          assigned_at?: string
          client_id: string
          contractor_id: string
          id?: string
        }
        Update: {
          assigned_at?: string
          client_id?: string
          contractor_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_assignments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      client_consumable_orders: {
        Row: {
          claim_amount: number | null
          claim_status: string | null
          client_id: string
          created_at: string
          id: string
          item: string
          notes: string | null
          order_date: string | null
        }
        Insert: {
          claim_amount?: number | null
          claim_status?: string | null
          client_id: string
          created_at?: string
          id?: string
          item: string
          notes?: string | null
          order_date?: string | null
        }
        Update: {
          claim_amount?: number | null
          claim_status?: string | null
          client_id?: string
          created_at?: string
          id?: string
          item?: string
          notes?: string | null
          order_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_consumable_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          conflicts_and_risks: string | null
          consent_pre_interview: boolean | null
          consent_pre_interview_date: string | null
          created_at: string
          current_stage_id: string | null
          diversity: string | null
          dob: string | null
          email: string | null
          funding_number: string | null
          funding_source: string | null
          gender: string | null
          id: string
          initial_one_month_review_date: string | null
          intake_source: string | null
          name: string
          notes: string | null
          phone: string | null
          plan_review_date: string | null
          plan_service_meeting_interview: boolean | null
          plan_service_meeting_interview_date: string | null
          quarterly_review_date: string | null
          representative_email: string | null
          representative_name: string | null
          representative_phone: string | null
          separation_date: string | null
          separation_reason: string | null
          service_agreement_contract_agreement: boolean | null
          service_agreement_date: string | null
          service_commencement_date: string | null
          services_position: string | null
          status: string
          updated_at: string
          yearly_clinical_assessment_date: string | null
        }
        Insert: {
          address?: string | null
          conflicts_and_risks?: string | null
          consent_pre_interview?: boolean | null
          consent_pre_interview_date?: string | null
          created_at?: string
          current_stage_id?: string | null
          diversity?: string | null
          dob?: string | null
          email?: string | null
          funding_number?: string | null
          funding_source?: string | null
          gender?: string | null
          id?: string
          initial_one_month_review_date?: string | null
          intake_source?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          plan_review_date?: string | null
          plan_service_meeting_interview?: boolean | null
          plan_service_meeting_interview_date?: string | null
          quarterly_review_date?: string | null
          representative_email?: string | null
          representative_name?: string | null
          representative_phone?: string | null
          separation_date?: string | null
          separation_reason?: string | null
          service_agreement_contract_agreement?: boolean | null
          service_agreement_date?: string | null
          service_commencement_date?: string | null
          services_position?: string | null
          status?: string
          updated_at?: string
          yearly_clinical_assessment_date?: string | null
        }
        Update: {
          address?: string | null
          conflicts_and_risks?: string | null
          consent_pre_interview?: boolean | null
          consent_pre_interview_date?: string | null
          created_at?: string
          current_stage_id?: string | null
          diversity?: string | null
          dob?: string | null
          email?: string | null
          funding_number?: string | null
          funding_source?: string | null
          gender?: string | null
          id?: string
          initial_one_month_review_date?: string | null
          intake_source?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          plan_review_date?: string | null
          plan_service_meeting_interview?: boolean | null
          plan_service_meeting_interview_date?: string | null
          quarterly_review_date?: string | null
          representative_email?: string | null
          representative_name?: string | null
          representative_phone?: string | null
          separation_date?: string | null
          separation_reason?: string | null
          service_agreement_contract_agreement?: boolean | null
          service_agreement_date?: string | null
          service_commencement_date?: string | null
          services_position?: string | null
          status?: string
          updated_at?: string
          yearly_clinical_assessment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_skills_development: {
        Row: {
          allocated_date: string | null
          contractor_id: string
          created_at: string
          id: string
          notes: string | null
          skill: string
          status: string | null
        }
        Insert: {
          allocated_date?: string | null
          contractor_id: string
          created_at?: string
          id?: string
          notes?: string | null
          skill: string
          status?: string | null
        }
        Update: {
          allocated_date?: string | null
          contractor_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          skill?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_skills_development_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          address: string | null
          conflicts_and_risks: string | null
          created_at: string
          credentialling_and_matching: string | null
          credentialling_status: string | null
          current_stage_id: string | null
          diversity: string | null
          dob: string | null
          email: string | null
          emergency_contact_email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string | null
          id: string
          initial_one_month_appraisal_date: string | null
          intake_source: string | null
          name: string
          notes: string | null
          phone: string | null
          quarterly_check_in_date: string | null
          separation_date: string | null
          separation_reason: string | null
          service_commencement_date: string | null
          services_position: string | null
          status: string
          updated_at: string
          wage_increase_review_date: string | null
          yearly_appraisal_date: string | null
        }
        Insert: {
          address?: string | null
          conflicts_and_risks?: string | null
          created_at?: string
          credentialling_and_matching?: string | null
          credentialling_status?: string | null
          current_stage_id?: string | null
          diversity?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          initial_one_month_appraisal_date?: string | null
          intake_source?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          quarterly_check_in_date?: string | null
          separation_date?: string | null
          separation_reason?: string | null
          service_commencement_date?: string | null
          services_position?: string | null
          status?: string
          updated_at?: string
          wage_increase_review_date?: string | null
          yearly_appraisal_date?: string | null
        }
        Update: {
          address?: string | null
          conflicts_and_risks?: string | null
          created_at?: string
          credentialling_and_matching?: string | null
          credentialling_status?: string | null
          current_stage_id?: string | null
          diversity?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          initial_one_month_appraisal_date?: string | null
          intake_source?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          quarterly_check_in_date?: string | null
          separation_date?: string | null
          separation_reason?: string | null
          service_commencement_date?: string | null
          services_position?: string | null
          status?: string
          updated_at?: string
          wage_increase_review_date?: string | null
          yearly_appraisal_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractors_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          id: string
          inbound_email_slug: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          inbound_email_slug?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          inbound_email_slug?: string | null
          name?: string
        }
        Relationships: []
      }
      intake_form_submissions: {
        Row: {
          created_at: string
          form_type: Database["public"]["Enums"]["pipeline_type"]
          id: string
          linked_client_id: string | null
          linked_contractor_id: string | null
          processed: boolean
          processed_at: string | null
          raw_data: Json
          source: string | null
          submitted_at: string
        }
        Insert: {
          created_at?: string
          form_type: Database["public"]["Enums"]["pipeline_type"]
          id?: string
          linked_client_id?: string | null
          linked_contractor_id?: string | null
          processed?: boolean
          processed_at?: string | null
          raw_data: Json
          source?: string | null
          submitted_at?: string
        }
        Update: {
          created_at?: string
          form_type?: Database["public"]["Enums"]["pipeline_type"]
          id?: string
          linked_client_id?: string | null
          linked_contractor_id?: string | null
          processed?: boolean
          processed_at?: string | null
          raw_data?: Json
          source?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_form_submissions_linked_client_id_fkey"
            columns: ["linked_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intake_form_submissions_linked_contractor_id_fkey"
            columns: ["linked_contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          project_id: string
          visibility: Database["public"]["Enums"]["note_visibility"]
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          project_id: string
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          project_id?: string
          visibility?: Database["public"]["Enums"]["note_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stage_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          client_id: string | null
          contractor_id: string | null
          entity_type: Database["public"]["Enums"]["pipeline_type"]
          from_stage_id: string | null
          id: string
          to_stage_id: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          client_id?: string | null
          contractor_id?: string | null
          entity_type: Database["public"]["Enums"]["pipeline_type"]
          from_stage_id?: string | null
          id?: string
          to_stage_id?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          client_id?: string | null
          contractor_id?: string | null
          entity_type?: Database["public"]["Enums"]["pipeline_type"]
          from_stage_id?: string | null
          id?: string
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stage_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_stage_history_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_stage_history_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_stage_history_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          created_at: string
          id: string
          name: string
          pipeline_type: Database["public"]["Enums"]["pipeline_type"]
          sort_order: number
          spawns_project: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          pipeline_type: Database["public"]["Enums"]["pipeline_type"]
          sort_order: number
          spawns_project?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          pipeline_type?: Database["public"]["Enums"]["pipeline_type"]
          sort_order?: number
          spawns_project?: boolean
        }
        Relationships: []
      }
      project_activity: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          project_id: string
          summary: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id: string
          summary: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          project_id?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          contractor_id: string | null
          created_at: string
          id: string
          name: string
          pipeline_type: Database["public"]["Enums"]["pipeline_type"]
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          name: string
          pipeline_type: Database["public"]["Enums"]["pipeline_type"]
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          id?: string
          name?: string
          pipeline_type?: Database["public"]["Enums"]["pipeline_type"]
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_task_templates: {
        Row: {
          category: string | null
          created_at: string
          department_id: string | null
          id: string
          pipeline_stage_id: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          pipeline_stage_id: string
          sort_order?: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          pipeline_stage_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_task_templates_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stage_task_templates_pipeline_stage_id_fkey"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category: string | null
          completed_at: string | null
          created_at: string
          department_id: string | null
          description: string | null
          due_date: string | null
          id: string
          project_id: string
          sort_order: number
          source_stage_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          sort_order?: number
          source_stage_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          sort_order?: number
          source_stage_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_source_stage_id_fkey"
            columns: ["source_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          body: string
          created_at: string
          direction: string
          id: string
          raw_email: Json | null
          sender_email: string | null
          sender_name: string | null
          ticket_id: string
        }
        Insert: {
          body: string
          created_at?: string
          direction: string
          id?: string
          raw_email?: Json | null
          sender_email?: string | null
          sender_name?: string | null
          ticket_id: string
        }
        Update: {
          body?: string
          created_at?: string
          direction?: string
          id?: string
          raw_email?: Json | null
          sender_email?: string | null
          sender_name?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          contractor_id: string | null
          created_at: string
          department_id: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          requester_email: string | null
          requester_name: string | null
          source: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_email?: string | null
          requester_name?: string | null
          source?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          contractor_id?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          requester_email?: string | null
          requester_name?: string | null
          source?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          contractor_id: string | null
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          contractor_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_contractor_id: { Args: never; Returns: string }
      auth_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      note_visibility: "internal" | "external"
      pipeline_type: "client" | "staff"
      project_status: "active" | "on_hold" | "completed" | "archived"
      task_status: "todo" | "in_progress" | "done" | "blocked"
      ticket_priority: "low" | "normal" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
      user_role: "admin" | "management" | "coordinator" | "support_worker"
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
      note_visibility: ["internal", "external"],
      pipeline_type: ["client", "staff"],
      project_status: ["active", "on_hold", "completed", "archived"],
      task_status: ["todo", "in_progress", "done", "blocked"],
      ticket_priority: ["low", "normal", "high", "urgent"],
      ticket_status: ["open", "in_progress", "waiting", "resolved", "closed"],
      user_role: ["admin", "management", "coordinator", "support_worker"],
    },
  },
} as const
