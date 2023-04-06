const server = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('/drafts', () => {
    let createdDraftId;

    beforeEach((done) => {
        const draft = {
            subject_id: 1
        };
        chai.request(server)
            .post('/api/drafts')
            .send(draft)
            .end((err, res) => {
                chai.expect(res).to.have.status(201);
                chai.expect(res.body).to.be.an('object');
                chai.expect(res.body).to.have.property('id');
                createdDraftId = res.body.id;
                done();
            });
    });

    // Test GET /drafts endpoint
    describe('GET /api/drafts', () => {
        it('should return all drafts', (done) => {
            chai.request(server)
                .get('/api/drafts')
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    // Test POST /drafts endpoint
    describe('POST /api/drafts', () => {
        it('should create a new draft', (done) => {
            const draft = {
                subject_id: 1
            };
            chai.request(server)
                .post('/api/drafts')
                .send(draft)
                .end((err, res) => {
                    chai.expect(res).to.have.status(201); // Updated to 201, as that's the status code in the API for successful creation
                    chai.expect(res.body).to.be.an('object');
                    chai.expect(res.body).to.have.property('id');
                    done();
                });
        });
    });

    // Test DELETE /drafts/:id endpoint
    describe('DELETE /api/drafts/:id', () => {
        it('should delete an existing draft', (done) => {
            chai.request(server)
                .get(`/api/drafts/${createdDraftId}/full`)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.be.an('array');
                    const id = res.body[0].id; // assuming at least one draft exists
                    chai.request(server)
                        .delete(`/api/drafts/${id}`)
                        .end((err, res) => {
                            chai.expect(res).to.have.status(200);
                            chai.request(server)
                                .get(`/api/drafts/${id}`)
                                .end((err, res) => {
                                    chai.expect(res).to.have.status(404);
                                    done();
                                });
                        });
                });
        });
    });
    

    // Add after() hook to close the server
    after((done) => {
        server.close(() => {
            done();
        });
    });
});
