-- Insert sample service categories
INSERT INTO service_categories (name, description, icon, color, department_id) 
SELECT 
    'IT Services',
    'Technology support and equipment requests',
    'laptop',
    'blue',
    d.id
FROM departments d WHERE d.name = 'Information Technology';

INSERT INTO service_categories (name, description, icon, color, department_id)
SELECT 
    'HR Services',
    'Human resources and employee support',
    'users',
    'green',
    d.id
FROM departments d WHERE d.name = 'Human Resources';

-- Insert sample services for IT
INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Laptop Request',
    'Request new laptop or replacement',
    sc.id,
    120,
    4.8
FROM service_categories sc WHERE sc.name = 'IT Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'VPN Access',
    'Request VPN access for remote work',
    sc.id,
    4,
    4.9
FROM service_categories sc WHERE sc.name = 'IT Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Software Installation',
    'Install approved software',
    sc.id,
    24,
    4.7
FROM service_categories sc WHERE sc.name = 'IT Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Password Reset',
    'Reset forgotten passwords',
    sc.id,
    2,
    4.2
FROM service_categories sc WHERE sc.name = 'IT Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'BYOD Setup',
    'Configure personal device for work',
    sc.id,
    24,
    3.8
FROM service_categories sc WHERE sc.name = 'IT Services';

-- Insert sample services for HR
INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Leave Request',
    'Submit vacation or sick leave',
    sc.id,
    48,
    4.9
FROM service_categories sc WHERE sc.name = 'HR Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Employment Letter',
    'Request employment verification letter',
    sc.id,
    72,
    4.6
FROM service_categories sc WHERE sc.name = 'HR Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Benefits Inquiry',
    'Questions about health, dental, retirement',
    sc.id,
    4,
    4.4
FROM service_categories sc WHERE sc.name = 'HR Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Payroll Issue',
    'Report payroll discrepancies',
    sc.id,
    48,
    3.2
FROM service_categories sc WHERE sc.name = 'HR Services';

INSERT INTO services (name, description, category_id, estimated_time_hours, rating)
SELECT 
    'Grievance Filing',
    'File formal complaint or grievance',
    sc.id,
    168,
    2.8
FROM service_categories sc WHERE sc.name = 'HR Services';

-- Insert sample accounts
INSERT INTO accounts (name, website, country, support_channel, status) VALUES
('Acme Corporation', 'https://acme.com', 'United States', 'email', 'active'),
('TechFlow Solutions', 'https://techflow.ca', 'Canada', 'slack', 'active'),
('Global Dynamics', 'https://globaldynamics.co.uk', 'United Kingdom', 'phone', 'inactive');
