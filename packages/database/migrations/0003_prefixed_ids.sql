-- 0003_prefixed_ids.sql
--
-- Relay-owned identifiers use the same sortable, prefixed representation in
-- PostgreSQL and at every application boundary. Keeping one representation
-- avoids lossy UUID adapters and makes tenant claims directly comparable to
-- row ownership columns under RLS.

CREATE OR REPLACE FUNCTION app.new_id(id_prefix text)
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = pg_catalog, pg_temp
AS $$
DECLARE
  alphabet constant text := '0123456789abcdefghjkmnpqrstvwxyz';
  random_bytes bytea := substring(
    decode(replace(gen_random_uuid()::text, '-', ''), 'hex')
    FROM 1 FOR 10
  );
  value numeric := floor(extract(epoch FROM clock_timestamp()) * 1000)
    * power(2::numeric, 80);
  encoded text := '';
  byte_index integer;
  digit integer;
BEGIN
  IF id_prefix IS NULL OR id_prefix !~ '^[a-z][a-z0-9]{0,31}$' THEN
    RAISE EXCEPTION 'invalid Relay id prefix'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  FOR byte_index IN 0..9 LOOP
    value := value + get_byte(random_bytes, byte_index)
      * power(256::numeric, 9 - byte_index);
  END LOOP;

  FOR byte_index IN 1..26 LOOP
    digit := mod(value, 32)::integer;
    encoded := substr(alphabet, digit + 1, 1) || encoded;
    value := trunc(value / 32);
  END LOOP;

  RETURN id_prefix || '_' || encoded;
END;
$$;

COMMENT ON FUNCTION app.new_id(text) IS
  'Generates a Relay <prefix>_<26 Crockford characters> identifier for database defaults.';

REVOKE ALL ON FUNCTION app.new_id(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.new_id(text) TO anon, authenticated, service_role;
