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
      devices: {
        Row: {
          id: string
          device_code: string
          device_type: string
          manufacturer: string | null
          model: string | null
          serial_number: string | null
          calibration_date: string | null
          next_calibration_date: string | null
          status: 'active' | 'inactive' | 'maintenance' | 'fault'
          specifications: Json | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          device_code: string
          device_type: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          calibration_date?: string | null
          next_calibration_date?: string | null
          status?: 'active' | 'inactive' | 'maintenance' | 'fault'
          specifications?: Json | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          device_code?: string
          device_type?: string
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          calibration_date?: string | null
          next_calibration_date?: string | null
          status?: 'active' | 'inactive' | 'maintenance' | 'fault'
          specifications?: Json | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      experiments: {
        Row: {
          id: string
          experiment_code: string
          experiment_type: 'high_voltage' | 'leakage_current' | 'normal_operation' | 'abnormal_operation' | 'simulation'
          device_id: string | null
          standard_id: string | null
          start_time: string
          end_time: string | null
          operator_id: string | null
          status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          result: 'pass' | 'fail' | 'warning' | 'na' | null
          test_parameters: Json | null
          environmental_conditions: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experiment_code: string
          experiment_type: 'high_voltage' | 'leakage_current' | 'normal_operation' | 'abnormal_operation' | 'simulation'
          device_id?: string | null
          standard_id?: string | null
          start_time: string
          end_time?: string | null
          operator_id?: string | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          result?: 'pass' | 'fail' | 'warning' | 'na' | null
          test_parameters?: Json | null
          environmental_conditions?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experiment_code?: string
          experiment_type?: 'high_voltage' | 'leakage_current' | 'normal_operation' | 'abnormal_operation' | 'simulation'
          device_id?: string | null
          standard_id?: string | null
          start_time?: string
          end_time?: string | null
          operator_id?: string | null
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
          result?: 'pass' | 'fail' | 'warning' | 'na' | null
          test_parameters?: Json | null
          environmental_conditions?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_data: {
        Row: {
          id: string
          experiment_id: string | null
          timestamp: string
          sequence_number: number | null
          voltage: number | null
          current: number | null
          power: number | null
          resistance: number | null
          temperature: number | null
          humidity: number | null
          pressure: number | null
          additional_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          experiment_id?: string | null
          timestamp: string
          sequence_number?: number | null
          voltage?: number | null
          current?: number | null
          power?: number | null
          resistance?: number | null
          temperature?: number | null
          humidity?: number | null
          pressure?: number | null
          additional_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string | null
          timestamp?: string
          sequence_number?: number | null
          voltage?: number | null
          current?: number | null
          power?: number | null
          resistance?: number | null
          temperature?: number | null
          humidity?: number | null
          pressure?: number | null
          additional_data?: Json | null
          created_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          experiment_id: string | null
          parameter_name: string
          measured_value: number | null
          unit: string | null
          pass_fail: 'pass' | 'fail' | 'warning' | 'na' | null
          min_limit: number | null
          max_limit: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experiment_id?: string | null
          parameter_name: string
          measured_value?: number | null
          unit?: string | null
          pass_fail?: 'pass' | 'fail' | 'warning' | 'na' | null
          min_limit?: number | null
          max_limit?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string | null
          parameter_name?: string
          measured_value?: number | null
          unit?: string | null
          pass_fail?: 'pass' | 'fail' | 'warning' | 'na' | null
          min_limit?: number | null
          max_limit?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      test_standards: {
        Row: {
          id: string
          standard_name: string
          standard_code: string
          version: string | null
          parameters: Json | null
          limits: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          standard_name: string
          standard_code: string
          version?: string | null
          parameters?: Json | null
          limits?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          standard_name?: string
          standard_code?: string
          version?: string | null
          parameters?: Json | null
          limits?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      data_files: {
        Row: {
          id: string
          experiment_id: string | null
          file_name: string
          file_type: string | null
          file_size: number | null
          file_path: string | null
          upload_time: string
          uploaded_by: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          experiment_id?: string | null
          file_name: string
          file_type?: string | null
          file_size?: number | null
          file_path?: string | null
          upload_time?: string
          uploaded_by?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string | null
          file_name?: string
          file_type?: string | null
          file_size?: number | null
          file_path?: string | null
          upload_time?: string
          uploaded_by?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      alarms: {
        Row: {
          id: string
          experiment_id: string | null
          alarm_type: string
          severity: 'info' | 'warning' | 'critical' | 'emergency'
          parameter_name: string | null
          alarm_value: number | null
          threshold_value: number | null
          message: string | null
          acknowledged: boolean
          acknowledged_by: string | null
          acknowledged_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          experiment_id?: string | null
          alarm_type: string
          severity: 'info' | 'warning' | 'critical' | 'emergency'
          parameter_name?: string | null
          alarm_value?: number | null
          threshold_value?: number | null
          message?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          experiment_id?: string | null
          alarm_type?: string
          severity?: 'info' | 'warning' | 'critical' | 'emergency'
          parameter_name?: string | null
          alarm_value?: number | null
          threshold_value?: number | null
          message?: string | null
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      experiment_summary: {
        Row: {
          id: string
          experiment_code: string
          experiment_type: string
          status: string
          result: string | null
          start_time: string
          end_time: string | null
          device_code: string | null
          device_type: string | null
          standard_name: string | null
          standard_code: string | null
          data_point_count: number
          unacknowledged_alarms: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      device_status: 'active' | 'inactive' | 'maintenance' | 'fault'
      experiment_status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
      experiment_type: 'high_voltage' | 'leakage_current' | 'normal_operation' | 'abnormal_operation' | 'simulation'
      test_result: 'pass' | 'fail' | 'warning' | 'na'
    }
  }
}