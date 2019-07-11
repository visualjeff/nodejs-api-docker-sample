'use strict';

const Code = require('@hapi/code'); // assertion library
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;

const { init } = require('../server');

lab.experiment("Exercise users --> ", async () => {
    let server;

    lab.before(async () => {
        server = await init();
    });

    lab.after(async () => {
        await server.stop();
    });

    //create	
    lab.test('Post to add a record', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'Sleipnir', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });

    //create a batch of children
    lab.test('Post to add a collection of children', async () => {
        const res = await server.inject({
	    method: 'post',
	    url: '/add',
	    payload: [{ name: 'Bonnie', legs: 2}, { name: 'Shea', legs: 2 }, { name: 'Ian', legs: 2 }]
	});
	expect(res.statusCode).to.equal(201);
    });

    //read all	
    lab.test('Get all records', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result).to.be.array();
	expect(res.result.length).to.be.greaterThan(1);    
    });
    
    //read	
    lab.test('Get a record', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/Sleipnir'
        });
        expect(res.statusCode).to.equal(200);
    });
    
    //create
    lab.test('Post to add a record again', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'jeff', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
    //read
    lab.test('Get the record we just added', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
    });

    //update	
    lab.test('Update the record we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: 'jeff', legs: 3 }
        });
        expect(res.statusCode).to.equal(204);
    });

    //read
    lab.test('Get the record we just updated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result.legs).to.equal(3);
    });

    //delete	
    lab.test('Delete a record', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: 'Sleipnir' }
        });
        expect(res.statusCode).to.equal(201);
    });

    
    //read all	
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

