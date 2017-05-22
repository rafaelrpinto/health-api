let bunyan = require('bunyan');
// project dependencies
let repository = require('../repository/redisRepository')

let log = bunyan.createLogger({name: 'enum-controller', stream: process.stdout});

/**
 * Controller that handles requests for enum lists.
 */
class EnumController {}

/**
 * Route that retreives all the facility types.
 * @return {Array}        List of facility types.
 */
EnumController.getFacilityTypes = (req, res, next) => {
  return getEnum(res, next, 'getFacilityTypes');
}

/**
 * Route that retreives all the opening hours.
 * @return {Array}        List of opening hours.
 */
EnumController.getOpeningHours = (req, res, next) => {
  return getEnum(res, next, 'getOpeningHours');
}

/**
 * Route that retreives all the medical services.
 * @return {Array}        List of medical services.
 */
EnumController.getServices = (req, res, next) => {
  return getEnum(res, next, 'getServices');
}

/**
 * Route that retreives all cities from a state.
 * @return {Array}        List of cities within a specific state.
 */
EnumController.getCities = (req, res, next) => {
  return getEnum(res, next, 'getCities', [req.params.state.toUpperCase()]);
}

/**
 * Retrieves all the neighborhoods of a city.
 * @return {Array}        List of neighborhoods within a specific city.
 */
EnumController.getNeighborhoods = (req, res, next) => {
  return getEnum(res, next, 'getNeighborhoods', [req.params.city]);
}

/**
 * Common function that requests for enum lists.
 * @param  {String}   repositoryMethod Repository method to be called.
 * @param  {Array}   repositoryMethodArgs Optional arguments to be passed to the repository.
 * @return {Array}                    Array of enums.
 */
async function getEnum(res, next, repositoryMethod, repositoryMethodArgs) {
  try {
    let rows = await repository[repositoryMethod].apply(this, repositoryMethodArgs);
    let result = rows.map((row) => {
      let tmp = row.split(':');
      return {id: tmp[0], description: tmp[1]}
    });
    res.json(result);
  } catch (err) {
    res.send(500, err);
    log.error(`Error executing '${repositoryMethod}'`, {err: err});
  } finally {
    next();
  }
}

module.exports = EnumController;
