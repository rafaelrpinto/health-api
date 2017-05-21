let redis = require("redis");
let bunyan = require("bunyan");
let Promise = require("bluebird");

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

module.exports = RedisRepository;
