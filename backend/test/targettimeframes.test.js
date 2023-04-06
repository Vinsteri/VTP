const assert = require('chai').assert;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const db = require('../db');

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe('Target Timeframes API', () => {
    beforeEach(async () => {
        // Clean up the database
        await db.query('DELETE FROM target_timeframes');
    });

    afterEach(async () => {
        // Clean up the database
        await db.query('DELETE FROM target_timeframes');
    });

    describe('POST /api/target_timeframes', () => {
        it('should create a new target timeframe record', async () => {
            const res = await request(app)
                .post('/api/target_timeframes')
                .send({ draft_id: 1, goal: 'Test goal', planned_date: '2022-01-01', actual_date: '2022-01-02', comments: 'Test comments', document_id: 1, link_text: 'Test link' });
        
            if (res.status !== 201 || typeof res.body.id !== 'number') {
                console.error('Unexpected response body:', res.body);
            }
        
            assert.equal(res.status, 201);
            assert.isNumber(res.body.id);
        });
        

        it('should return an error when missing required fields', async () => {
            const res = await request(app)
                .post('/api/target_timeframes')
                .send({ planned_date: '2022-01-01', actual_date: '2022-01-02', comments: 'Test comments', document_id: 1, link_text: 'Test link' });
            assert.equal(res.status, 500);
            assert.equal(res.body.error, 'Error creating target timeframes');
        });
    });

    describe('GET /api/target_timeframes/:id', () => {
        it('should retrieve the target timeframe with the given id', async () => {
            const postResponse = await request(app)
                .post('/api/target_timeframes')
                .send({ draft_id: 1, goal: 'Test goal', planned_date: '2022-01-01', actual_date: '2022-01-02', comments: 'Test comments', document_id: 1, link_text: 'Test link' });

            const targetTimeframeId = postResponse.body.id;
            const response = await chai.request(app).get(`/api/target_timeframes/${targetTimeframeId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.include({
                id: targetTimeframeId,
                draft_id: 1,
                goal: 'Test goal',
                comments: 'Test comments',
                document_id: 1,
                link_text: 'Test link'
            });
        });

        it('should return a 404 error if the target timeframe does not exist', async () => {
            const response = await chai.request(app).get('/api/target_timeframes/9999');
            expect(response).to.have.status(404);
            expect(response.body).to.deep.equal({ error: 'Target timeframes not found' });
        });
    });

    describe('PUT /api/target_timeframes/:id', () => {
        it('should update an existing target timeframe', async () => {
            const postResponse = await request(app)
                .post('/api/target_timeframes')
                .send({ draft_id: 1, goal: 'Test goal', planned_date: '2022-01-01', actual_date: '2022-01-02', comments: 'Test comments', document_id: 1, link_text: 'Test link' });

            const targetTimeframeId = postResponse.body.id;

            const res = await request(app)
            .put(`/api/target_timeframes/${targetTimeframeId}`)
            .send({ draft_id: 2, goal: 'Updated goal', planned_date: '2022-01-05', actual_date: '2022-01-06', comments: 'Updated comments', document_id: 2, link_text: 'Updated link' });

            assert.equal(res.status, 200);
            assert.equal(res.body.message, 'Target timeframes updated successfully');

            const response = await chai.request(app).get(`/api/target_timeframes/${targetTimeframeId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.include({
                id: targetTimeframeId,
                draft_id: 2,
                goal: 'Updated goal',
                comments: 'Updated comments',
                document_id: 2,
                link_text: 'Updated link'
            });
        });

        it('should return a 404 error if the target timeframe does not exist', async () => {
            const res = await request(app)
                .put('/api/target_timeframes/9999')
                .send({ draft_id: 2, goal: 'Updated goal', planned_date: '2022-01-05', actual_date: '2022-01-06', comments: 'Updated comments', document_id: 2, link_text: 'Updated link' });

            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Target timeframes not found');
        });
    });

    describe('DELETE /api/target_timeframes/:id', () => {
        it('should delete an existing target timeframe', async () => {
            const postResponse = await request(app)
                .post('/api/target_timeframes')
                .send({ draft_id: 1, goal: 'Test goal', planned_date: '2022-01-01', actual_date: '2022-01-02', comments: 'Test comments', document_id: 1, link_text: 'Test link' });

            const targetTimeframeId = postResponse.body.id;
            const res = await request(app).delete(`/api/target_timeframes/${targetTimeframeId}`);

            assert.equal(res.status, 200);
            assert.equal(res.body.message, 'Target timeframes deleted successfully');
        });

        it('should return a 404 error if the target timeframe does not exist', async () => {
            const res = await request(app).delete('/api/target_timeframes/9999');
            assert.equal(res.status, 404);
            assert.equal(res.body.error, 'Target timeframes not found');
        });
    });
});

