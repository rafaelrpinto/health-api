let bunyan = require('bunyan');
// project dependencies
let repository = require('../repository/redisRepository');

// log setup
let log = bunyan.createLogger({name: 'health-facility-controller', stream: process.stdout});

/**
 * Controller that handles facility retrieval requests.
 */
class HealthFacilityController {}

/**
 * Finds the fecilities which provide a specific service on a specific state.
 */
HealthFacilityController.getFacilitiesByServiceAndState = async(req, res, next) => {
  try {
    if (isNaN(req.params.service) || !req.params.state || isNaN(req.params.page)) {
      res.send(400, 'Invalid parameters.');
      return;
    }

    let facilities = await repository.getFacilitiesByServiceAndState(req.params.service, req.params.state, req.params.page);
    res.json(facilities);
  } catch (err) {
    res.send(500, 'Internal error');
    log.error(`Error retrieving facilities by service (${req.params.service}) and state (${req.params.state})`, {err});
  } finally {
    next();
  }
};

/**
 * Finds the fecilities which provide a specific service on a specific state/city.
 */
HealthFacilityController.getFacilitiesByServiceStateAndCity = async(req, res, next) => {
  try {
    if (isNaN(req.params.service) || !req.params.state || isNaN(req.params.city) || isNaN(req.params.page)) {
      res.send(400, 'Invalid parameters.');
      return;
    }

    let facilities = await repository.getFacilitiesByServiceStateAndCity(req.params.service, req.params.state, req.params.city, req.params.page);
    res.json(facilities);
  } catch (err) {
    res.send(500, 'Internal error');
    log.error(`Error retrieving facilities by service (${req.params.service}), state (${req.params.state}) and city (${req.params.city})`, {err});
  } finally {
    next();
  }
};

/**
 * Finds a facility by it's id.
 */
HealthFacilityController.getFacility = async(req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      res.send(400, 'Invalid parameters.');
      return;
    }

    let facility = await repository.getFacility(req.params.id);

    if (facility) {
      res.json(facility);
    } else {
      res.send(404, 'Facility not found');
    }
  } catch (err) {
    res.send(500, 'Internal error');
    log.error(`Error retrieving facility by id (${req.params.id})`, {err});
  } finally {
    next();
  }
};

/**
 * Finds the nearest facilities from a specific coordinate.
 */
HealthFacilityController.getNearestFacilities = async(req, res, next) => {
  try {
    if (isNaN(req.params.lat) || isNaN(req.params.long)) {
      res.send(400, 'Invalid parameters.');
      return;
    }

    let facilities = await repository.getNearestFacilities(req.params.lat, req.params.long);
    res.json(facilities);
  } catch (err) {
    res.send(500, 'Internal error');
    log.error('Error retrieving facility by location', {err});
  } finally {
    next();
  }
};

/**
 * Finds the nearest facilities ids from a specific coordinate.
 */
HealthFacilityController.getNearestFacilitiesIds = async(req, res, next) => {
  try {
    if (isNaN(req.params.lat) || isNaN(req.params.long)) {
      res.send(400, 'Invalid parameters.');
      return;
    }

    let facilities = await repository.getNearestFacilitiesIds(req.params.lat, req.params.long);
    res.json(facilities);
  } catch (err) {
    res.send(500, 'Internal error');
    log.error('Error retrieving facilities ids by location', {err});
  } finally {
    next();
  }
};

module.exports = HealthFacilityController;
