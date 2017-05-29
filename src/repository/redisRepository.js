let redis = require("redis");
let bunyan = require("bunyan");
let Promise = require("bluebird");
// project deps
let redisScripts = require('../lua/redisScripts');

// Max items per page
const PAGE_SIZE = 10;
const SEARCH_RADIUS = 2;

// async redis client
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// logger setup
let log = bunyan.createLogger({name: "redis-logger"});

// https://www.npmjs.com/package/redis#rediscreateclient
let redisClient = redis.createClient();

// Redis error listener
redisClient.on("error", function(err) {
  log.error({err: err});
});

/**
 * Repository that retrieves the data from Redis.
 */
class RedisRepository {}

/**
 * Retrieves all the facility type enums.
 * @return {Promise} Promise to resolve an array of facility types.
 */
RedisRepository.getFacilityTypes = () => {
  return redisClient.zrangeAsync('facility_type_list', 0, -1);
}

/**
 * Retrieves all the opening hours enums.
 * @return {Promise} Promise to resolve an array of opening hours.
 */
RedisRepository.getOpeningHours = () => {
  return redisClient.zrangeAsync('facility_opening_hours_list', 0, -1);
}

/**
 * Retrieves all the medical services.
 * @return {Promise} Promise to resolve an array of medical services.
 */
RedisRepository.getServices = () => {
  return redisClient.zrangeAsync('service_list', 0, -1);
}

/**
 * Retrieves all the cities of a state.
 * @return {Promise} Promise to resolve an array of cities.
 */
RedisRepository.getCities = (state) => {
  return redisClient.zrangeAsync(`cities:${state}`, 0, -1);
}

/**
 * Retrieves all the health fecilities that provide a service on a state.
 * @param  {Integer} serviceId Id of the target service.
 * @param  {String} state     Target state.
 * @param  {Integer} page     Page to be retrieved.
 * @return {Promise} Promise to resolve a peginated facilities response.
 */
RedisRepository.getFacilitiesByServiceAndState = (serviceId, state, page) => {
  return getFacilities(`service:${serviceId}:${state}`, page);
}

/**
 * Retrieves all the health fecilities that provide a service on a state/city.
 * @param  {Integer} serviceId Id of the target service.
 * @param  {String} state     Target state.
 * @param  {String} cityId     Target city id.
 * @param  {Integer} page     Page to be retrieved.
 * @return {Promise} Promise to resolve a peginated facilities response.
 */
RedisRepository.getFacilitiesByServiceStateAndCity = (serviceId, state, cityId, page) => {
  return getFacilities(`service:${serviceId}:${state}:${cityId}`, page);
}

/**
 * Retrieves the details of a facility by it's id.
 * @param  {Integer} id Facilities id.
 * @return {Object}    Facility object or null if not found.
 */
RedisRepository.getFacility = async(id) => {
  let facilityHash = await redisClient.hgetallAsync(`facility:${id}`);
  return hash2model(facilityHash);
}

/**
 * Retrieves the full details of facilities closest to the informed coordinates.
 *
 * @param  {Number} latitude  Reference latitude.
 * @param  {Number} longitude Reference longitude.
 * @return {Promise}           Promise to resolve the facilities according to the parameters.
 */
RedisRepository.getNearestFacilities = async(latitude, longitude) => {
  //script keys / arguments
  let args = [1].concat("geo_facilities", [
    longitude,
    latitude,
    SEARCH_RADIUS,
    "km"
  ]);
  args.unshift(redisScripts['nearestFacilties']);

  // executes the script on redis
  let result = await redisClient.send_commandAsync('eval', args);

  // converts the response objects
  return result.map((row) => {
    return hash2model(replyToObject(row));
  });

}

/**
 * Retrieves the ids of all facilities closest to the informed coordinates.
 * @return {Promise}           Promise to resolve the facilities according to the parameters.
 */
RedisRepository.getNearestFacilitiesIds = async(latitude, longitude) => {
  let facilities = redisClient.georadiusAsync('geo_facilities', longitude, latitude, SEARCH_RADIUS, 'km', 'WITHCOORD');
  return facilities.map((facility) => {
    return {id: facility[0], longitude: facility[1][0], latitude: facility[1][1]
    }
  });
}

/**
 * Retreives the database version.
 * @return {Promise} A promise to retrieve the db version.
 */
RedisRepository.getDbVersion = () => {
  return redisClient.getAsync('db_version');
}

// ############ private functions ##############

/*
 * Transforms a redis response into a json object. Copied from node_redis.
 * @see https://github.com/NodeRedis/node_redis/blob/master/lib/utils.js
 */
function replyToObject(reply) {
  // The reply might be a string or a buffer if this is called in a transaction (multi)
  if (reply.length === 0 || !(reply instanceof Array)) {
    return null;
  }
  var obj = {};
  for (var i = 0; i < reply.length; i += 2) {
    obj[reply[i].toString('binary')] = reply[i + 1];
  }
  return obj;
}

/**
 * Template method for retrieving paginated facilities.
 * @param  {String} key  Target redis key.
 * @param  {Integer} page Target page number.
 * @return {Promise} Promise to resolve a peginated facilities response.
 */
async function getFacilities(key, page) {
  // pagination ranges
  let interval = page2interval(page);

  let batch = redisClient.batch();

  batch.zcard(key); //count
  batch.zrange(key, interval.start, interval.end);

  // get the ids from redis
  let result = await batch.execAsync();

  // total ids
  let count = parseInt(result[0]);
  // Get the drtailed rows based on the ids
  let rows = await getFacilitesDetails(result[1]);

  return buildPaginatedResponse(count, page, rows);
}

/**
 * Builds the standard paginated response structure.
 * @param  {Integer} count Total rows in the key.
 * @param  {Integer} page  Current page.
 * @param  {Array} rows  Query result.
 * @return {Object}      Standard paginated response.
 */
function buildPaginatedResponse(count, page, rows) {
  return {totalCount: count, page: page, pageSize: PAGE_SIZE, rows: rows};
}

/**
 * Retrieves the full details of the facilities within the id array.
 * @param  {Array} ids List of facilities ids to match the search.
 * @return {Promise}     Promise to retrieve an array of objects containing the full details of the facilites.
 */
async function getFacilitesDetails(ids) {
  if (!ids || ids.length == 0) {
    return [];
  }

  // batch to reduce flights
  let batch = redisClient.batch();

  // get all the details on a single request
  for (let id of ids) {
    batch.hgetall(`facility:${id}`);
  }

  // call redis
  let results = await batch.execAsync();

  // transform the structure
  return results.map(hash2model);
}

/**
 * Transform a facility hash to the app model.
 * @param  {Object} result Facility hash.
 * @return {Object}        Data as app model.
 */
function hash2model(result) {
  if (!result) {
    return null;
  }

  return {
    id: parseInt(result.id),
    type: parseInt(result.type),
    openingHours: parseInt(result.openingHours),
    services: result.services.split(',').map((val) => parseInt(val)),
    name: result.name,
    businessName: result.businessName,
    phone: result.phone,
    latitude: parseFloat(result.latitude),
    longitude: parseFloat(result.longitude),
    address: {
      street: result['address.street'],
      number: result['address.number'],
      neighborhood: result['address.neighborhood'],
      postalCode: result['address.postalCode'],
      state: result['address.state'],
      city: result['address.city'],
      cityId: parseInt(result['address.city.id'])
    }
  }
}

/**
 * Utility method to calculate a range based on a page.
 * @param  {Integer} page Page number
 * @return {Object}      Interval for the page.
 */
function page2interval(page) {
  return {
    end: (page * PAGE_SIZE) - 1,
    start: (page - 1) * PAGE_SIZE
  }
}

module.exports = RedisRepository;
