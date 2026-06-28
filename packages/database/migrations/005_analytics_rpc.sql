-- Function to safely increment paste view count
CREATE OR REPLACE FUNCTION increment_paste_view(p_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.pastes
  SET view_count = view_count + 1
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate analytics efficiently
CREATE OR REPLACE FUNCTION get_user_analytics(p_user_id UUID)
RETURNS jsonb AS $$
DECLARE
  v_result jsonb;
  v_total_views integer;
BEGIN
  -- Get total views
  SELECT count(*) INTO v_total_views
  FROM public.paste_views pv
  JOIN public.pastes p ON p.id = pv.paste_id
  WHERE p.user_id = p_user_id;

  IF v_total_views = 0 THEN
    RETURN jsonb_build_object(
      'browsers', '[]'::jsonb,
      'os', '[]'::jsonb,
      'devices', '[]'::jsonb,
      'referrers', '[]'::jsonb,
      'totalViews', 0
    );
  END IF;

  WITH user_pastes AS (
    SELECT id FROM public.pastes WHERE user_id = p_user_id
  ),
  browser_stats AS (
    SELECT browser as name, count(*) as count
    FROM public.paste_views
    WHERE paste_id IN (SELECT id FROM user_pastes) AND browser IS NOT NULL
    GROUP BY browser
    ORDER BY count DESC
  ),
  os_stats AS (
    SELECT os as name, count(*) as count
    FROM public.paste_views
    WHERE paste_id IN (SELECT id FROM user_pastes) AND os IS NOT NULL
    GROUP BY os
    ORDER BY count DESC
  ),
  device_stats AS (
    SELECT device_type as name, count(*) as count
    FROM public.paste_views
    WHERE paste_id IN (SELECT id FROM user_pastes) AND device_type IS NOT NULL
    GROUP BY device_type
    ORDER BY count DESC
  ),
  -- Extract domain from referrer
  parsed_referrers AS (
    SELECT 
      CASE 
        WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
        WHEN referrer LIKE 'http%://%/%' THEN 
          split_part(split_part(referrer, '://', 2), '/', 1)
        ELSE referrer
      END as name
    FROM public.paste_views
    WHERE paste_id IN (SELECT id FROM user_pastes)
  ),
  referrer_stats AS (
    SELECT name, count(*) as count
    FROM parsed_referrers
    GROUP BY name
    ORDER BY count DESC
  )
  SELECT jsonb_build_object(
    'browsers', COALESCE((SELECT jsonb_agg(row_to_json(b)) FROM browser_stats b), '[]'::jsonb),
    'os', COALESCE((SELECT jsonb_agg(row_to_json(o)) FROM os_stats o), '[]'::jsonb),
    'devices', COALESCE((SELECT jsonb_agg(row_to_json(d)) FROM device_stats d), '[]'::jsonb),
    'referrers', COALESCE((SELECT jsonb_agg(row_to_json(r)) FROM referrer_stats r), '[]'::jsonb),
    'totalViews', v_total_views
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
