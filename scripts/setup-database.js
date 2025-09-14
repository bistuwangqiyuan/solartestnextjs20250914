const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up database schema...');

  try {
    // Create tables
    const { error: tablesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create enum types
        DO $$ BEGIN
          CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance', 'fault');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;

        DO $$ BEGIN
          CREATE TYPE experiment_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;

        DO $$ BEGIN
          CREATE TYPE experiment_type AS ENUM ('high_voltage', 'leakage_current', 'normal_operation', 'abnormal_operation', 'simulation');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;

        DO $$ BEGIN
          CREATE TYPE test_result AS ENUM ('pass', 'fail', 'warning', 'na');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;

        -- Create devices table
        CREATE TABLE IF NOT EXISTS devices (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          device_code VARCHAR(100) UNIQUE NOT NULL,
          device_type VARCHAR(100) NOT NULL,
          manufacturer VARCHAR(200),
          model VARCHAR(200),
          serial_number VARCHAR(200) UNIQUE,
          calibration_date DATE,
          next_calibration_date DATE,
          status device_status DEFAULT 'active',
          specifications JSONB,
          location VARCHAR(200),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create test_standards table
        CREATE TABLE IF NOT EXISTS test_standards (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          standard_name VARCHAR(200) NOT NULL,
          standard_code VARCHAR(100) UNIQUE NOT NULL,
          version VARCHAR(50),
          parameters JSONB,
          limits JSONB,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create experiments table
        CREATE TABLE IF NOT EXISTS experiments (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          experiment_code VARCHAR(100) UNIQUE NOT NULL,
          experiment_type experiment_type NOT NULL,
          device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
          standard_id UUID REFERENCES test_standards(id),
          start_time TIMESTAMPTZ NOT NULL,
          end_time TIMESTAMPTZ,
          operator_id UUID,
          status experiment_status DEFAULT 'pending',
          result test_result,
          test_parameters JSONB,
          environmental_conditions JSONB,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create test_data table (for time-series data)
        CREATE TABLE IF NOT EXISTS test_data (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
          timestamp TIMESTAMPTZ NOT NULL,
          sequence_number INTEGER,
          voltage DECIMAL(10, 4),
          current DECIMAL(10, 6),
          power DECIMAL(10, 4),
          resistance DECIMAL(12, 4),
          temperature DECIMAL(6, 2),
          humidity DECIMAL(5, 2),
          pressure DECIMAL(8, 2),
          additional_data JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create test_results table (for summary results)
        CREATE TABLE IF NOT EXISTS test_results (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
          parameter_name VARCHAR(200) NOT NULL,
          measured_value DECIMAL(20, 6),
          unit VARCHAR(50),
          pass_fail test_result,
          min_limit DECIMAL(20, 6),
          max_limit DECIMAL(20, 6),
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create data_files table
        CREATE TABLE IF NOT EXISTS data_files (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
          file_name VARCHAR(500) NOT NULL,
          file_type VARCHAR(50),
          file_size BIGINT,
          file_path TEXT,
          upload_time TIMESTAMPTZ DEFAULT NOW(),
          uploaded_by UUID,
          metadata JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create alarms table
        CREATE TABLE IF NOT EXISTS alarms (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
          alarm_type VARCHAR(100) NOT NULL,
          severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical', 'emergency')),
          parameter_name VARCHAR(200),
          alarm_value DECIMAL(20, 6),
          threshold_value DECIMAL(20, 6),
          message TEXT,
          acknowledged BOOLEAN DEFAULT FALSE,
          acknowledged_by UUID,
          acknowledged_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_experiments_device_id ON experiments(device_id);
        CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
        CREATE INDEX IF NOT EXISTS idx_experiments_type ON experiments(experiment_type);
        CREATE INDEX IF NOT EXISTS idx_experiments_start_time ON experiments(start_time DESC);
        CREATE INDEX IF NOT EXISTS idx_test_data_experiment_id ON test_data(experiment_id);
        CREATE INDEX IF NOT EXISTS idx_test_data_timestamp ON test_data(experiment_id, timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_alarms_experiment_id ON alarms(experiment_id);
        CREATE INDEX IF NOT EXISTS idx_alarms_severity ON alarms(severity);
        CREATE INDEX IF NOT EXISTS idx_alarms_acknowledged ON alarms(acknowledged);

        -- Create views for common queries
        CREATE OR REPLACE VIEW experiment_summary AS
        SELECT 
          e.id,
          e.experiment_code,
          e.experiment_type,
          e.status,
          e.result,
          e.start_time,
          e.end_time,
          d.device_code,
          d.device_type,
          ts.standard_name,
          ts.standard_code,
          COUNT(DISTINCT td.id) as data_point_count,
          COUNT(DISTINCT a.id) FILTER (WHERE a.acknowledged = false) as unacknowledged_alarms
        FROM experiments e
        LEFT JOIN devices d ON e.device_id = d.id
        LEFT JOIN test_standards ts ON e.standard_id = ts.id
        LEFT JOIN test_data td ON e.id = td.experiment_id
        LEFT JOIN alarms a ON e.id = a.experiment_id
        GROUP BY e.id, d.id, ts.id;

        -- Create RLS policies
        ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
        ALTER TABLE test_standards ENABLE ROW LEVEL SECURITY;
        ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE test_data ENABLE ROW LEVEL SECURITY;
        ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
        ALTER TABLE data_files ENABLE ROW LEVEL SECURITY;
        ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;

        -- Create policies (adjust based on your auth strategy)
        CREATE POLICY "Enable read access for all users" ON devices FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON test_standards FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON experiments FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON test_data FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON test_results FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON data_files FOR SELECT USING (true);
        CREATE POLICY "Enable read access for all users" ON alarms FOR SELECT USING (true);
      `
    });

    if (tablesError) {
      console.error('Error creating tables:', tablesError);
      return;
    }

    console.log('✅ Database schema created successfully');

    // Insert sample test standards
    const { error: standardsError } = await supabase
      .from('test_standards')
      .insert([
        {
          standard_name: 'IEC 62109-1 Safety Requirements',
          standard_code: 'IEC-62109-1',
          version: '2023',
          parameters: {
            high_voltage_test: {
              voltage_levels: [600, 1000, 1500],
              test_duration: [1, 5, 60],
              pass_criteria: 'No breakdown or flashover'
            },
            leakage_current: {
              max_current: 0.005,
              test_voltage: 1.1,
              measurement_accuracy: 0.0001
            }
          },
          limits: {
            insulation_resistance: { min: 1000000 },
            leakage_current: { max: 0.005 },
            response_time: { max: 0.03 }
          }
        },
        {
          standard_name: 'UL 1741 SA Rapid Shutdown',
          standard_code: 'UL-1741-SA',
          version: '2023',
          parameters: {
            shutdown_voltage: { max: 30 },
            shutdown_time: { max: 30 },
            activation_method: ['manual', 'automatic', 'remote']
          },
          limits: {
            voltage_after_shutdown: { max: 30 },
            time_to_shutdown: { max: 30 }
          }
        }
      ]);

    if (standardsError) {
      console.error('Error inserting test standards:', standardsError);
    } else {
      console.log('✅ Sample test standards inserted');
    }

    // Insert sample devices
    const { error: devicesError } = await supabase
      .from('devices')
      .insert([
        {
          device_code: 'PVRSD-001',
          device_type: 'PVRSD-1500',
          manufacturer: 'SolarTech Industries',
          model: 'ST-RSD-1500V',
          serial_number: 'ST202501001',
          calibration_date: '2025-01-01',
          next_calibration_date: '2026-01-01',
          status: 'active',
          specifications: {
            max_voltage: 1500,
            max_current: 15,
            response_time: 0.025,
            operating_temp: { min: -40, max: 85 }
          },
          location: 'Test Lab A - Station 1'
        }
      ]);

    if (devicesError) {
      console.error('Error inserting devices:', devicesError);
    } else {
      console.log('✅ Sample devices inserted');
    }

    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('Fatal error during database setup:', error);
  }
}

setupDatabase();