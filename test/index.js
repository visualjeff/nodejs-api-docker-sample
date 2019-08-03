'use strict';

const Code = require('@hapi/code'); // assertion library
const Lab = require('@hapi/lab'); //Test framework (based on Mocha)
const lab = exports.lab = Lab.script();
const expect = Code.expect;

const { init } = require('../server'); //Import the init method from the server.

lab.experiment("Exercise endpoints --> ", async () => {
    let server;

    lab.before(async () => {
        server = await init(); //Start server
    });

    lab.after(async () => {
        await server.stop(); //Stop server
    });

    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'Sleipnir', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });

    //read all of the children from the database
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(1);    
    });
    
    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'Bonnie', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'Shea', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });

    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'Ian', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
	
    //read all of the children from the database
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.greaterThan(1);    
    });
    
    //read a child out of the database
    lab.test('Get a record', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/Sleipnir'
        });
        expect(res.statusCode).to.equal(200);
    });
    
    //create a child in the database using POST
    lab.test('Post to add a record again', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'jeff', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //read the record we just created.
    lab.test('Get the record we just added', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
    });

    //update the record we just created
    lab.test('Update the record we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: 'jeff', legs: 3 }
        });
        expect(res.statusCode).to.equal(204);
    });

    //read the record we just updated
    lab.test('Get the record we just updated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result.legs).to.equal(3);
    });

    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: 'Sleipnir' }
        });
        expect(res.statusCode).to.equal(201);
    });

    
    //read all of the database records
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(4);    
    });
    
});

