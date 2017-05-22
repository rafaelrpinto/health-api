let bunyan = require('bunyan');
// project dependencies
let repository = require('../repository/redisRepository')

// log setup
let log = bunyan.createLogger({name: 'health-facility-controller', stream: process.stdout});

class HealthFacilityController {}

HealthFacilityController.getFacilitiesByServiceAndState = async(req, res, next) => {
  try {
    //TODO param validation
    let facilities = await repository.getFacilitiesByServiceAndState(req.params.service, req.params.state, req.params.page);
    res.json(facilities);
  } catch (err) {
    res.send(500, 'Internal error');
    log.error(`Error retrieving facilities by service (${req.params.service}) and state (${req.params.state})`, {err: err});
  } finally {
    next();
  }
}

module.exports = HealthFacilityController;
