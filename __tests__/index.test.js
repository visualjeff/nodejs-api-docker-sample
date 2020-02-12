'use strict';

const faker = require('faker');

const sleep = require('util').promisify(setTimeout);

const { init } = require('../server'); //Import the init method from the server.

describe("Exercise endpoints --> ", () => {
    let server;
    let initialNumberOfRecords;
    let randomNamesArray;

    beforeAll(function(done) {
        //Start server
	init().then((serverInstance) => {
          server = serverInstance;
          setTimeout(function() {
            //Get the initial number of records
            const entries = server.app.db.getCollection('children');
	    initialNumberOfRecords = entries.data.length;
        
            //Generate an array of random names to test with
	    randomNamesArray = new Array(5).fill({}).reduce((accumulator, value, index) => {
	       accumulator[index] = faker.name.firstName();     
               return accumulator;
	    }, []);
               done();
            }, 200);
        });
    });

    beforeEach(function(done) {
        setTimeout(function() {
          done();
        }, 50);
    });

    afterEach(function(done) {
        setTimeout(function() {
          done();
        }, 50);
    });	

    afterAll(function(done) {
        setTimeout(function() {}, 5000); //Let database autosave take place
        server.stop(); //Stop server
    });

    //create db record via a POST	
    test('Post to add a record', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[0], legs: 2 }
        }).then(function(res) {
          expect(res.statusCode).toBe(201);
          done();
        });
    });

    //read all of the children from the database
    test('Get all records', function(done) {
        const res = server.inject({
            method: 'get',
            url: '/'
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
	    //expect(res.result).to.be.array();
	    expect(res.result.length).toBe(initialNumberOfRecords + 1);
            done();
        });
    });
  
    //create db record via a POST	
    test('Post to add a record', function(done) {
        const res = server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[1], legs: 2 }
        }).then(function() {
            expect(res.statuscode).toBe(201);
            done()
        });
    });

    //create db record via a POST	
    test('Post to add a record', function(done) {
        const res = server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[2], legs: 2 }
        }).then(function() {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //create db record via a POST	
    test('Post to add a record', function(done) {
        const res = server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[3], legs: 2 }
        }).then(function() {
            expect(res.statuscode).toBe(201);
            done();
        });
    });
/*    
    //create db record via a POST, but with a bad payload.	
    test('Post to add a record', async () => {
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
    test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(initialNumberOfRecords + 4);    
    });
    
    //read a child out of the database
    test('Get a record', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[0]}`
        });
        expect(res.statusCode).to.equal(200);
    });

    //create a child in the database using POST
    test('Post to add a record again', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[4], legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //create a child in the database using POST, but with a incomplete payload
    test('Post to add a record again', async () => {
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
    test('Get the record we just added', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        });
        expect(res.statusCode).to.equal(200);
    });

    //update the record we just created
    test('Update the record we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: randomNamesArray[4], legs: 99 }
        });
        expect(res.statusCode).to.equal(204);
    });

    //update the record we just created, but with an incomplete playload
    test('Update the record we just added', async () => {
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
    test('Get the record we just updated', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result.legs).to.equal(99);
    });

    test('Get the records with 99 legs', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/query/99'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.equal(1);
    });	

    //delete a record from the database using DELETE	
    test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[0] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[1] }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //delete a record from the database using DELETE	
    test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[2] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[3] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE	
    test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[4] }
        });
        expect(res.statusCode).to.equal(201);
    });

    //delete a record from the database using DELETE, but with a bad payload	
    test('Delete a record', async () => {
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
    test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.equal(initialNumberOfRecords);    
    });
*/
});

