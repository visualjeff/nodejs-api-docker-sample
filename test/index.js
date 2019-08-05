'use strict';

const Code = require('@hapi/code'); // assertion library
const Lab = require('@hapi/lab'); //Test framework (based on Mocha)
const lab = exports.lab = Lab.script();
const expect = Code.expect;

const faker = require('faker');

const sleep = require('util').promisify(setTimeout);

const { init } = require('../server'); //Import the init method from the server.

lab.experiment("Exercise endpoints --> ", async () => {
    let server;
    let initialNumberOfRecords;
    let randomNamesArray;

    lab.before(async () => {
        //Start server
	server = await init();

        await sleep(100);

	//Get the initial number of records
        const entries = server.app.db.getCollection('children');
	initialNumberOfRecords = entries.data.length;

        //Generate an array of random names to test with
	randomNamesArray = new Array(5).fill({}).reduce((accumulator, value, index) => {
	    accumulator[index] = faker.name.firstName();     
            return accumulator;
	}, []);

    });

    lab.beforeEach(async () => {
        await sleep(50);
    });

    lab.afterEach(async () => {
        //await sleep(50);
    });	

    lab.after(async () => {
        await sleep(5000); //Let database autosave take place
        await server.stop(); //Stop server
    });

    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[0], legs: 2 }
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
	expect(res.result.length).to.be.equal(initialNumberOfRecords + 1);    
    });
   
    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[1], legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
   
    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[2], legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });

    //create db record via a POST	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[3], legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //create db record via a POST, but with a bad payload.	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[3], legs: 'A' }
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('Invalid request payload input');
    });

    //read all of the children from the database
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(initialNumberOfRecords + 4);    
    });
    
    //read a child out of the database
    lab.test('Get a record', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[0]}`
        });
        expect(res.statusCode).to.equal(200);
    });

    //create a child in the database using POST
    lab.test('Post to add a record again', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[4], legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //create a child in the database using POST, but with a incomplete payload
    lab.test('Post to add a record again', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[4] }
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('Invalid request payload input');
    });

    //read the record we just created.
    lab.test('Get the record we just added', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        });
        expect(res.statusCode).to.equal(200);
    });

    //update the record we just created
    lab.test('Update the record we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: randomNamesArray[4], legs: 99 }
        });
        expect(res.statusCode).to.equal(204);
    });

    //update the record we just created, but with an incomplete playload
    lab.test('Update the record we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: randomNamesArray[4] }
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('Invalid request payload input');
    });

    //read the record we just updated
    lab.test('Get the record we just updated', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result.legs).to.equal(99);
    });

    lab.test('Get the records with 99 legs', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/query/99'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.equal(1);
    });	

    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[0] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[1] }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[2] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[3] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[4] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE, but with a bad payload	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { namme: randomNamesArray[4] }
        });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('Invalid request payload input');
    });
	
    //read all of the database records
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(initialNumberOfRecords);    
    });

});

