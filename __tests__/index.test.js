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
            }, 100);
        });
    });

    beforeEach(function(done) {
        setTimeout(function() {
          done();
        }, 10);
    });

    afterEach(function(done) {
        setTimeout(function() {
          done();
        }, 10);
    });	

    afterAll(function(done) {
        setTimeout(function() {}, 2000); //Let database autosave take place
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
        server.inject({
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
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[1], legs: 2 }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done()
        });
    });

    //create db record via a POST	
    test('Post to add a record', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[2], legs: 2 }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //create db record via a POST	
    test('Post to add a record', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[3], legs: 2 }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });
 
    //create db record via a POST, but with a bad payload.	
    test('Post to add a record', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[3], legs: 'A' }
        }).then(function(res) {
            expect(res.statusCode).toBe(400);
            expect(res.result.error).toBe('Bad Request');
            expect(res.result.message).toBe('Invalid request payload input');
            done();
        });
    });
    
    //read all of the children from the database
    test('Get all records', function(done) {
        server.inject({
            method: 'get',
            url: '/'
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
	    expect(res.result.length).toBe(initialNumberOfRecords + 4);
            done(); 
        });
    });
 
    //read a child out of the database
    test('Get a record', function(done) {
        server.inject({
            method: 'get',
            url: `/${randomNamesArray[0]}`
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    //create a child in the database using POST
    test('Post to add a record again', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[4], legs: 2 }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });
    
    //create a child in the database using POST, but with a incomplete payload
    test('Post to add a record again', function(done) {
        server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: randomNamesArray[4] }
        }).then(function(res) {
            expect(res.statusCode).toBe(400);
            expect(res.result.error).toBe('Bad Request');
            expect(res.result.message).toBe('Invalid request payload input');
            done();
        });
    });
    
    //read the record we just created.
    test('Get the record we just added', function(done) {
        server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    //update the record we just created
    test('Update the record we just added', function(done) {
        server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: randomNamesArray[4], legs: 99 }
        }).then(function(res) {
            expect(res.statusCode).toBe(204);
            done();
        });
    });

    //update the record we just created, but with an incomplete playload
    test('Update the record we just added', function(done) {
        server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: randomNamesArray[4] }
        }).then(function(res) {
            expect(res.statusCode).toBe(400);
            expect(res.result.error).toBe('Bad Request');
            expect(res.result.message).toBe('Invalid request payload input');
            done();
        });
    });

    //read the record we just updated
    test('Get the record we just updated', function(done) {
        server.inject({
            method: 'get',
            url: `/${randomNamesArray[4]}`
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
	    expect(res.result.legs).toBe(99);
            done();
        });
    });

    test('Get the records with 99 legs', function(done) {
        server.inject({
            method: 'get',
            url: '/query/99'
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
	    expect(res.result.length).toBe(1);
            done();
        });
    });	

    //delete a record from the database using DELETE	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[0] }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //delete a record from the database using DELETE	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[1] }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });
    
    //delete a record from the database using DELETE	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[2] }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //delete a record from the database using DELETE	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[3] }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //delete a record from the database using DELETE	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: randomNamesArray[4] }
        }).then(function(res) {
            expect(res.statusCode).toBe(201);
            done();
        });
    });

    //delete a record from the database using DELETE, but with a bad payload	
    test('Delete a record', function(done) {
        server.inject({
            method: 'delete',
            url: '/delete',
            payload: { namme: randomNamesArray[4] }
        }).then(function(res) {
            expect(res.statusCode).toBe(400);
            expect(res.result.error).toBe('Bad Request');
            expect(res.result.message).toBe('Invalid request payload input');
            done();
        });
    });
	
    //read all of the database records
    test('Get all records', function(done) {
        server.inject({
            method: 'get',
            url: '/'
        }).then(function(res) {
            expect(res.statusCode).toBe(200);
	    expect(res.result.length).toBe(initialNumberOfRecords);
            done(); 
        });
    });

});

