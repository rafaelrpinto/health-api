let fs = require('fs');
let luamin = require('luamin');

// loads the script content
let nearestFaciltiesScript = fs.readFileSync(`${process.cwd()}/src/lua/nearestFacilties.lua`, 'utf8');
// minifies it on-the-fly
let nearestFaciltiesMin = luamin.minify(nearestFaciltiesScript);

// Object containing lua scripts to be used on redis
module.exports = {
  nearestFacilties: nearestFaciltiesMin
};
