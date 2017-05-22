--[[
  Lua script that retrieves the nearest facilities from a coordinate within a distance redius. All parameters are required.

  Usage example:
  redis-cli --eval src/lua/nearestFacilties.lua "geo_facilities" , "-43.244348" "-22.933380" 5 "km" 0 9

  Keys / Parameters:
  KEYS[1] = Geo index key
  ARGV[1] = Reference longitude
  ARGV[2] = Reference latitude
  ARGV[3] = Redius
  ARGV[4] = Redius unit
  ARGV[5] = Pagination start
  ARGV[6] = Pagination end
]]--

-- Get the fecilities ids from the key
local facilities = redis.call("georadius", KEYS[1], ARGV[1], ARGV[2], ARGV[3], ARGV[4], 'ASC');
-- Result count
local count = table.getn(facilities);

-- Pagination range
local first = tonumber(ARGV[5]);
local last = tonumber(ARGV[6]);

-- Make sure the end index is valid
if (last > (count - 1)) then
  last = count - 1;
end

-- Returns empty on invalid ranges
if (first >= last or first < 0) then
  return {}
end

-- There is no way (that I know of) to paginate georadius directly, so we need to extract the subset manually
local rows = {}
for i = first, last do
  rows[#rows + 1] = redis.call("hgetall", "facility:"..facilities[i + 1]);
end

-- Returns the total count and the page rows
return {count, rows}
