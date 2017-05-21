let repository = require('../repository/redisRepository')

/**
 * Function that sets up the routes.
 * @param  {Object} server Restify's server.
 * @return {function}        Function that sets up the routes.
 */
module.exports = (server) => {
  server.get('/facility/types', getFacilityTypes);
  server.get('/facility/opening_hours', getOpeningHours);
  server.get('/facility/services', getServices);
}

/**
 * Route that retreives all the facility types.
 * @return {Array}        List of facility types.
 */
async function getFacilityTypes(req, res, next) {
  try {

    let types = await repository.getFacilityTypes();

    let result = types.map((type) => {
      let tmp = type.split(':');
      return {id: tmp[0], description: tmp[1]}
    });

    res.json(result);
  } catch (err) {
    res.send(500, err);
  } finally {
    next();
  }
}

/**
 * Route that retreives all the opening hours.
 * @return {Array}        List of opening hours.
 */
async function getOpeningHours(req, res, next) {
  try {

    let hours = await repository.getOpeningHours();

    let result = hours.map((hour) => {
      let tmp = hour.split(':');
      return {id: tmp[0], description: tmp[1]}
    });

    res.json(result);
  } catch (err) {
    res.send(500, err);
  } finally {
    next();
  }
}

/**
 * Route that retreives all the opening hours.
 * @return {Array}        List of opening hours.
 */
async function getServices(req, res, next) {
  try {

    let services = await repository.getServices();

    let result = services.map((hour) => {
      let tmp = hour.split(':');
      return {id: tmp[0], description: tmp[1]}
    });

    res.json(result);
  } catch (err) {
    res.send(500, err);
  } finally {
    next();
  }
}
