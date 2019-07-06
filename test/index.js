'use strict';

const Code = require('@hapi/code'); // assertion library
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();
const expect = Code.expect;

const { init } = require('../server');

const util = require('util');
const sleep = require('util').promisify(setTimeout);

lab.experiment("Exercise users", async () => {
    let server;

    lab.before(async () => {
        server = await init();
    });

    lab.after(async () => {
        await server.stop();
    });

    lab.afterEach(async () => {
        //await sleep(1100);
    }); 

    lab.test('Get all children', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
    });
    
    lab.test('Get a child', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/Sleipnir'
        });
        expect(res.statusCode).to.equal(200);
    });
    
    lab.test('Post a child', async () => {
        const res = await server.inject({
            method: 'post',
            url: '/add',
	    payload: { name: 'jeff', legs: 2 }
        });
        expect(res.statusCode).to.equal(201);
    });
    
     lab.test('Get the child we just added', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
    });

    lab.test('Update the child we just added', async () => {
        const res = await server.inject({
            method: 'patch',
            url: '/update',
	    payload: { name: 'jeff', legs: 3 }
        });
        expect(res.statusCode).to.equal(204);
    });

    lab.test('Get the child we just updated', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/jeff'
        });
        expect(res.statusCode).to.equal(200);
	expect(res.result.legs).to.equal(3);
    });

    lab.test('Delete the child we just updated', async () => {
        const res = await server.inject({
            method: 'delete',
            url: '/delete',
            payload: { name: 'jeff' }
        });
        expect(res.statusCode).to.equal(201);
    });
});

