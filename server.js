'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Joi = require('@hapi/joi');
const HapiSwagger = require('hapi-swagger');
const server = Hapi.server({
    port: process.env.port || 1337, //default port 1337 is for running on Azure.
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        auth: false, //Public access allowed
        description: 'Route is website root.  Get all children',	
        tags: ['api'],
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
	tags: ['api'],
	validate: {
            params: {
                name: Joi.string()
            },
	},
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
    config: {
        auth: false, //Public access allowed
        description: 'Add a child or children',	
        tags: ['api'],
	plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },    
	validate: {
            payload: Joi.object({
                name: Joi.string(),
                legs: Joi.number()
            })
	},
        handler: async (request, h) => {
            if (request.payload) {
                const children = request.app.db.getCollection('children');
                children.insert({ name: request.payload.name, legs: request.payload.legs });
	        return h.response('success').code(201);
	    }
        }
    }
});

server.route({
    method: 'PATCH',
    path: '/update',
    config: {	
        auth: false, //Public access allowed
        description: 'Update a child',	
        tags: ['api'],
	plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },    
	validate: {
            payload: Joi.object({
                name: Joi.string(),
                legs: Joi.number()
            })
	},
        handler: async (request, h) => {
            if (request.payload) {
	        const children = request.app.db.getCollection('children');
	        const child = children.findOne({ 'name': request.payload.name });
	        child.legs = request.payload.legs;
	        children.update(child);
	        return h.response(null).code(204);
	    }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/delete',
    config: {	
        auth: false, //Public access allowed
        description: 'Delete a child',	
        tags: ['api'],
	plugins: {
            'hapi-swagger': {
                payloadType: 'form'
            }
        },    
	validate: {
            payload: Joi.object({
                name: Joi.string()
            })
	},
        handler: async (request, h) => {
	    const children = request.app.db.getCollection('children');
	    const child = children.findOne({ 'name': request.payload.name });
	    children.remove(child);
	    return h.response(null).code(201)
        }
    }
});

const init = async () => {
    const swaggerOptions = {
        schemes: ['http', 'https'],
        host: `localhost:${process.env.port || 1337}`,
        auth: false,
        info: {
            title: 'API Documentation',
            description: 'API Description here',
            version: '1.0.0',
            contact: {
                name: 'Test api',
                //url: '',
                email: 'visualjeff@icloud.com'
            }
        },
        sortEndpoints: "ordered"
    };

    await server.register([ Inert, Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },  
	{
        plugin: require('lokijs-plugin'),
        options: {
            env: 'NODEJS'
        }
    }, {
        plugin: require('hapi-graceful-shutdown-plugin'),
        options: {
            sigtermTimeout: 1,
            sigintTimeout: 1
        }
    }]);
    
    // LokiJS initializing code
    const db = server.app.db;
    (() => {
        let entries = db.getCollection('children');
        if (entries === null) {
            entries = db.addCollection('children', { indices: ['name'] }); //Datatable in database is called children
        }
    })(); //IIFE initializes the db.

    await server.initialize();
    return server;
};

const start = async () => {
    await init();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

//To handle promise rejections
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

//Added for unit testing
if (process.env.NODE_ENV == 'test') {
    //for unit testing
    exports.init = init;
} else {
    start();
}

