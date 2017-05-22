let enumController = require('../controller/enumController')
let healthFacilityController = require('../controller/healthFacilityController')

/**
 * Function that sets up the routes.
 * @param  {Object} server Restify's server.
 * @return {function}        Function that sets up the routes.
 */
module.exports = (server) => {
  // enums
  server.get('/facility/types', enumController.getFacilityTypes);
  server.get('/facility/opening_hours', enumController.getOpeningHours);
  server.get('/facility/services', enumController.getServices);
  server.get('/cities/:state', enumController.getCities);

  //facilities
  server.get('/facility/:id', healthFacilityController.getFacility);
  server.get('/service/:service/:state/:page', healthFacilityController.getFacilitiesByServiceAndState);
  server.get('/service/:service/:state/:city/:page', healthFacilityController.getFacilitiesByServiceStateAndCity);
}
