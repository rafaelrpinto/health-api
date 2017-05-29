--[[
  Lua script that retrieves the full details of the nearest facilities from a coordinate within a distance redius. All parameters are required.

  Usage example:
  redis-cli --eval src/lua/nearestFacilties.lua "geo_facilities" , "-43.244348" "-22.933380" 2 "km"

  Keys / Parameters:
  KEYS[1] = Geo index key
  ARGV[1] = Reference longitude
  ARGV[2] = Reference latitude
  ARGV[3] = Redius
  ARGV[4] = Redius unit
]]--

-- Get the fecilities ids from the key
local facilities = redis.call("georadius", KEYS[1], ARGV[1], ARGV[2], ARGV[3], ARGV[4], 'ASC');

-- for each facility id we fetch the full details
local rows = {}
for i = 0, #facilities do
  rows[#rows + 1] = redis.call("hgetall", "facility:"..facilities[i + 1]);
end

-- Returns the rows
return rows
