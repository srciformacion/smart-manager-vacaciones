export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      annual_hours: {
        Row: {
          base_hours: number
          created_at: string | null
          id: string
          personal_leave_hours: number
          remaining_hours: number
          seniority_adjustment: number
          sick_leave_hours: number
          updated_at: string | null
          user_id: string
          vacation_hours: number
          worked_hours: number
          year: number
        }
        Insert: {
          base_hours?: number
          created_at?: string | null
          id?: string
          personal_leave_hours?: number
          remaining_hours?: number
          seniority_adjustment?: number
          sick_leave_hours?: number
          updated_at?: string | null
          user_id: string
          vacation_hours?: number
          worked_hours?: number
          year: number
        }
        Update: {
          base_hours?: number
          created_at?: string | null
          id?: string
          personal_leave_hours?: number
          remaining_hours?: number
          seniority_adjustment?: number
          sick_leave_hours?: number
          updated_at?: string | null
          user_id?: string
          vacation_hours?: number
          worked_hours?: number
          year?: number
        }
        Relationships: []
      }
      balances: {
        Row: {
          id: string
          leavedays: number
          personaldays: number
          userid: string
          vacationdays: number
          year: number
        }
        Insert: {
          id?: string
          leavedays?: number
          personaldays?: number
          userid: string
          vacationdays?: number
          year: number
        }
        Update: {
          id?: string
          leavedays?: number
          personaldays?: number
          userid?: string
          vacationdays?: number
          year?: number
        }
        Relationships: []
      }
      calendar_shifts: {
        Row: {
          created_at: string | null
          date: string
          end_time: string | null
          exception_reason: string | null
          hours: number | null
          id: string
          is_exception: boolean | null
          notes: string | null
          start_time: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time?: string | null
          exception_reason?: string | null
          hours?: number | null
          id?: string
          is_exception?: boolean | null
          notes?: string | null
          start_time?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string | null
          exception_reason?: string | null
          hours?: number | null
          id?: string
          is_exception?: boolean | null
          notes?: string | null
          start_time?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_templates: {
        Row: {
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          shift_patterns: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          shift_patterns: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          shift_patterns?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          dni: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          start_date: string | null
          surname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          dni?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          start_date?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          dni?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          start_date?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          attachmenturl: string | null
          createdat: string | null
          enddate: string
          endtime: string | null
          id: string
          notes: string | null
          reason: string | null
          startdate: string
          starttime: string | null
          status: string
          type: string
          updatedat: string | null
          userid: string
        }
        Insert: {
          attachmenturl?: string | null
          createdat?: string | null
          enddate: string
          endtime?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          startdate: string
          starttime?: string | null
          status?: string
          type: string
          updatedat?: string | null
          userid: string
        }
        Update: {
          attachmenturl?: string | null
          createdat?: string | null
          enddate?: string
          endtime?: string | null
          id?: string
          notes?: string | null
          reason?: string | null
          startdate?: string
          starttime?: string | null
          status?: string
          type?: string
          updatedat?: string | null
          userid?: string
        }
        Relationships: []
      }
      shift_changes: {
        Row: {
          created_at: string | null
          id: string
          is_returned: boolean | null
          original_date: string
          original_user_id: string
          replacement_user_id: string
          request_id: string | null
          return_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_returned?: boolean | null
          original_date: string
          original_user_id: string
          replacement_user_id: string
          request_id?: string | null
          return_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_returned?: boolean | null
          original_date?: string
          original_user_id?: string
          replacement_user_id?: string
          request_id?: string | null
          return_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shift_changes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      work_time_alerts: {
        Row: {
          alert_date: string
          alert_type: string
          created_at: string
          id: string
          is_resolved: boolean
          message: string
          resolved_at: string | null
          resolved_by: string | null
          user_id: string
        }
        Insert: {
          alert_date: string
          alert_type: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          user_id: string
        }
        Update: {
          alert_date?: string
          alert_type?: string
          created_at?: string
          id?: string
          is_resolved?: boolean
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      work_time_module_config: {
        Row: {
          alert_incomplete_workday: boolean
          alert_missing_records: boolean
          alert_overtime: boolean
          break_duration_minutes: number
          created_at: string
          daily_hours_limit: number
          id: string
          is_enabled: boolean
          lunch_duration_minutes: number
          updated_at: string
          weekly_hours_limit: number
        }
        Insert: {
          alert_incomplete_workday?: boolean
          alert_missing_records?: boolean
          alert_overtime?: boolean
          break_duration_minutes?: number
          created_at?: string
          daily_hours_limit?: number
          id?: string
          is_enabled?: boolean
          lunch_duration_minutes?: number
          updated_at?: string
          weekly_hours_limit?: number
        }
        Update: {
          alert_incomplete_workday?: boolean
          alert_missing_records?: boolean
          alert_overtime?: boolean
          break_duration_minutes?: number
          created_at?: string
          daily_hours_limit?: number
          id?: string
          is_enabled?: boolean
          lunch_duration_minutes?: number
          updated_at?: string
          weekly_hours_limit?: number
        }
        Relationships: []
      }
      work_time_records: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          clock_in_time: string | null
          clock_out_time: string | null
          created_at: string
          date: string
          id: string
          lunch_end_time: string | null
          lunch_start_time: string | null
          notes: string | null
          status: string
          total_worked_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string
          date: string
          id?: string
          lunch_end_time?: string | null
          lunch_start_time?: string | null
          notes?: string | null
          status?: string
          total_worked_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          clock_in_time?: string | null
          clock_out_time?: string | null
          created_at?: string
          date?: string
          id?: string
          lunch_end_time?: string | null
          lunch_start_time?: string | null
          notes?: string | null
          status?: string
          total_worked_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
