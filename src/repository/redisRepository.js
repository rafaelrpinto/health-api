let redis = require("redis");
let bunyan = require("bunyan");
let Promise = require("bluebird");

const PAGE_SIZE = 10;

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
 * @param  {Integer} start     Start index.
 * @param  {Integer} end       End index.
 * @return {Promise} Promise to resolve an array of facilities id's.
 */
RedisRepository.getFacilitiesByServiceAndState = async(serviceId, state, page) => {
  let key = `service:${serviceId}:${state}`;
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
  let rows = await getFacilites(result[1]);

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
async function getFacilites(ids) {
  if (!ids || ids.length == 0) {
    return [];
  }

  // batch to reduce flights
  let batch = redisClient.batch();

  // get all the details on a single request
  for (let id of ids) {
    let key = `facility:${id}`;
    batch.hgetall(key);
  }

  // call redis
  let results = await batch.execAsync();

  // transform the structure
  return results.map((result) => {
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
  });
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
