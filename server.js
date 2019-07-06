'use strict';

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: process.env.port || 1337,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: false, //Public access allowed
        description: 'Route is website root.  Get all children',	
        handler: async (request, h) => {
            const children = request.app.db.getCollection('children');
	    return h.response(children.data);
        }
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    config: {
        auth: false, //Public access allowed
        description: 'Get / find a children',	
        handler: async (request, h) => {
            if (request.params.name) {
	        const children = request.app.db.getCollection('children');
		const child = children.findOne( {'name': request.params.name } );
		return h.response(child);
	    }
       }
    }
});


server.route({
    method: 'POST',
    path: '/add',
    handler: async (request, h) => {
        if (request.payload) {
            const children = request.app.db.getCollection('children');
            children.insert({ name: request.payload.name, legs: request.payload.legs  })
	    return h.response('success').code(201);
	}
    }	
});

server.route({
    method: 'PATCH',
    path: '/update',
    handler: async (request, h) => {
        if (request.payload) {
	    const children = request.app.db.getCollection('children');
	    const child = children.findOne({ 'name': request.payload.name });
	    child.legs = request.payload.legs;
	    children.update(child);
	    return h.response(null).code(204);
	}
    }
});

server.route({
    method: 'DELETE',
    path: '/delete',
    handler: async (request, h) => {
	const children = request.app.db.getCollection('children');
	const child = children.findOne({ 'name': request.payload.name });
	children.remove(child);
	return h.response(null).code(201)
    }
});

const init = async () => {
    await server.register([{
        plugin: require('lokijs-plugin'),
        options: {
            env: 'NODEJS'
	    //verbose: true,
	    //autosave: true, //Will result in the creation of a file loki.db
	    //autosaveInterval: 1000
        }
    }, {
        plugin: require('hapi-graceful-shutdown-plugin'),
        options: {
            sigtermTimeout: 1,
            sigintTimeout: 1
        }
    }]);
    
    /* LokiJS Test code */
    const db = server.app.db;
    const children = db.addCollection('children');
    children.insert({name:'Sleipnir', legs: 8})
    
   /* 
    server.app.db.getCollection('children');
    let child = children.get(1);
    console.log(child);
    
    child.legs = 9;
    children.update(child);

    child = children.get(1);
    console.log(child);
*/
    await server.initialize();
    return server;
};

const start = async () => {
    await init();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


if (process.env.NODE_ENV == 'test') {
    exports.init = init;
} else {
    start();
}

