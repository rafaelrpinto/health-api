let restify = require('restify');
let bunyan = require('bunyan');
//project dependencies
let setupRoutes = require('./routes/routes');

let log = bunyan.createLogger({name: 'health-api', stream: process.stdout});
let server = restify.createServer();

server.server.setTimeout(5000);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({mapParams: true, mapFiles: false}));

setupRoutes(server);

server.listen(8080, function() {
  log.info('%s listening at %s', server.name, server.url);
});
