-- Function to calculate SLA breach status
CREATE OR REPLACE FUNCTION check_sla_breach(ticket_id UUID)
RETURNS TABLE (
    is_response_breached BOOLEAN,
    is_resolution_breached BOOLEAN,
    response_time_remaining_minutes INTEGER,
    resolution_time_remaining_minutes INTEGER
) AS $$
DECLARE
    ticket_record RECORD;
    sla_record RECORD;
    response_deadline TIMESTAMP WITH TIME ZONE;
    resolution_deadline TIMESTAMP WITH TIME ZONE;
    current_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Get ticket and SLA policy information
    SELECT t.*, s.response_time_minutes, s.resolution_time_minutes
    INTO ticket_record
    FROM tickets t
    LEFT JOIN sla_policies s ON t.sla_policy_id = s.id
    WHERE t.id = ticket_id;
    
    -- If no SLA policy is assigned, return null values
    IF ticket_record.sla_policy_id IS NULL THEN
        RETURN QUERY SELECT FALSE, FALSE, NULL::INTEGER, NULL::INTEGER;
        RETURN;
    END IF;
    
    -- Calculate deadlines
    response_deadline := ticket_record.created_at + (ticket_record.response_time_minutes || ' minutes')::INTERVAL;
    resolution_deadline := ticket_record.created_at + (ticket_record.resolution_time_minutes || ' minutes')::INTERVAL;
    
    -- Check response breach (only if ticket hasn't been responded to)
    is_response_breached := (current_time > response_deadline AND ticket_record.status = 'open');
    
    -- Check resolution breach (only if ticket hasn't been resolved)
    is_resolution_breached := (current_time > resolution_deadline AND ticket_record.status NOT IN ('resolved', 'closed'));
    
    -- Calculate remaining time
    response_time_remaining_minutes := EXTRACT(EPOCH FROM (response_deadline - current_time)) / 60;
    resolution_time_remaining_minutes := EXTRACT(EPOCH FROM (resolution_deadline - current_time)) / 60;
    
    RETURN QUERY SELECT 
        is_response_breached,
        is_resolution_breached,
        response_time_remaining_minutes::INTEGER,
        resolution_time_remaining_minutes::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign SLA policy based on priority
CREATE OR REPLACE FUNCTION auto_assign_sla_policy()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-assign SLA policy based on priority if not already assigned
    IF NEW.sla_policy_id IS NULL THEN
        SELECT id INTO NEW.sla_policy_id
        FROM sla_policies
        WHERE priority = CASE 
            WHEN NEW.priority = 'critical' THEN 'P1'
            WHEN NEW.priority = 'high' THEN 'P2'
            WHEN NEW.priority = 'medium' THEN 'P3'
            WHEN NEW.priority = 'low' THEN 'P4'
            ELSE 'P3'
        END
        AND is_active = true
        LIMIT 1;
    END IF;
    
    -- Set due date based on SLA policy
    IF NEW.sla_policy_id IS NOT NULL AND NEW.due_date IS NULL THEN
        SELECT NEW.created_at + (resolution_time_minutes || ' minutes')::INTERVAL
        INTO NEW.due_date
        FROM sla_policies
        WHERE id = NEW.sla_policy_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assigning SLA policies
DROP TRIGGER IF EXISTS auto_assign_sla_trigger ON tickets;
CREATE TRIGGER auto_assign_sla_trigger
    BEFORE INSERT OR UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_sla_policy();

-- View for SLA compliance reporting
CREATE OR REPLACE VIEW sla_compliance_report AS
SELECT 
    sp.name as sla_policy_name,
    sp.priority,
    sp.response_time_minutes,
    sp.resolution_time_minutes,
    COUNT(t.id) as total_tickets,
    COUNT(CASE WHEN t.status != 'open' AND t.created_at + (sp.response_time_minutes || ' minutes')::INTERVAL >= COALESCE(t.resolved_at, t.updated_at) THEN 1 END) as response_met,
    COUNT(CASE WHEN t.status IN ('resolved', 'closed') AND t.created_at + (sp.resolution_time_minutes || ' minutes')::INTERVAL >= t.resolved_at THEN 1 END) as resolution_met,
    ROUND(
        (COUNT(CASE WHEN t.status != 'open' AND t.created_at + (sp.response_time_minutes || ' minutes')::INTERVAL >= COALESCE(t.resolved_at, t.updated_at) THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(CASE WHEN t.status != 'open' THEN 1 END), 0)) * 100, 2
    ) as response_compliance_percentage,
    ROUND(
        (COUNT(CASE WHEN t.status IN ('resolved', 'closed') AND t.created_at + (sp.resolution_time_minutes || ' minutes')::INTERVAL >= t.resolved_at THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(CASE WHEN t.status IN ('resolved', 'closed') THEN 1 END), 0)) * 100, 2
    ) as resolution_compliance_percentage
FROM sla_policies sp
LEFT JOIN tickets t ON sp.id = t.sla_policy_id
WHERE sp.is_active = true
GROUP BY sp.id, sp.name, sp.priority, sp.response_time_minutes, sp.resolution_time_minutes
ORDER BY sp.priority;
