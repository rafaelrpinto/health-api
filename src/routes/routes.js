let enumController = require('../controller/enumController')

/**
 * Function that sets up the routes.
 * @param  {Object} server Restify's server.
 * @return {function}        Function that sets up the routes.
 */
module.exports = (server) => {
  server.get('/facility/types', enumController.getFacilityTypes);
  server.get('/facility/opening_hours', enumController.getOpeningHours);
  server.get('/facility/services', enumController.getServices);
  server.get('/cities/:state', enumController.getCities);
}
