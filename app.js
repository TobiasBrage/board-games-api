const restify = require('restify');
const corsmiddleware = require('restify-cors-middleware');
const server = restify.createServer({
    'name': 'hifi',
    'version': '1.0.0'
});

server.use(restify.plugins.bodyParser());
const cors = corsmiddleware({ origins: ['*'] });
server.pre(cors.preflight);
server.use(cors.actual);

require('./routes/index')(server);
console.log('Port: 1337');
console.log('URL: bruger:1337');

server.listen(1337);

// test