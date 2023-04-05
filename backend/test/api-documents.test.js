const chai = require('chai');
const chaiHttp = require('chai-http');
const db = require('../db');
const app = require('../index');

chai.use(chaiHttp);
const { expect } = chai;

describe('/api/documents', () => {
  let draftId;
  let subjectId;

  before(async () => {
    // Clear the documents table before running tests
    await db.query('DELETE FROM documents');
  
    // Insert a test inspection_subject
    const subjectResult = await db.query("INSERT INTO inspection_subject (name) VALUES ('Test Subject')");
    subjectId = subjectResult[0].insertId;
  
    // Check if subjectId is null
    if (!subjectId) {
      throw new Error('subjectId cannot be null');
    }
  
    // Insert a test draft with the created subject_id
    const draftResult = await db.query("INSERT INTO drafts (subject_id) VALUES (?)", [subjectId]);
    draftId = draftResult[0].insertId;

    if (!draftId) {
      throw new Error('draftId cannot be null');
    }

    // Insert test data
    const testDocuments = [
      { draft_id: draftId, title: 'Test Document 1', handler: 'John Doe', modified: '2022-01-01 12:00:00' },
      { draft_id: draftId, title: 'Test Document 2', handler: 'Jane Doe', modified: '2022-02-01 12:00:00' },
      { draft_id: draftId, title: 'Test Document 3', handler: 'John Smith', modified: '2022-03-01 12:00:00' },
    ];

    for (const doc of testDocuments) {
      await db.query('INSERT INTO documents SET ?', doc);
    }
  });

  describe('POST /', () => {
    it('should create a new document', async () => {
      const document = {
        draft_id: draftId,
        title: 'New Document',
        handler: 'John Smith',
        modified: '2022-03-08 12:00:00'
      };
      const res = await chai.request(app).post('/api/documents').send(document);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body.title).to.equal(document.title);
      expect(res.body.handler).to.equal(document.handler);
      expect(res.body.modified).to.equal(document.modified);
    });    

    it('should return an error if the request body is invalid', async () => {
      const document = {
        handler: 'John Smith',
        modified: '2022-03-08 12:00:00'
      };
      const res = await chai.request(app).post('/api/documents').send(document);
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /', () => {
    it('should return all documents', async () => {
      const res = await chai.request(app).get('/api/documents');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').with.lengthOf.at.least(3); // assumes there are at least 3 documents in the database
    });
  });

  describe('PUT /:id', () => {
    it('should update an existing document', async () => {
      // Insert a draft into the drafts table
      const [draftResult] = await db.query('INSERT INTO drafts (subject_id) VALUES (?)', [subjectId]);
      const draftId = draftResult.insertId;
  
      const existingDocument = { draft_id: draftId, title: 'Existing Document', handler: 'Setä Manula', modified: '2022-01-31 00:00:00' };
      const [existingDocumentResult] = await db.query('INSERT INTO documents SET ?', existingDocument);
      const documentId = existingDocumentResult.insertId;
  
      const updatedDocument = { draft_id: draftId, title: 'Updated Document', handler: 'Jane Doe', modified: '2022-03-08 12:00:00' };
      const res = await chai.request(app).put(`/api/documents/${documentId}`).send(updatedDocument);
      expect(res).to.have.status(204);
      
      const [result] = await db.query('SELECT * FROM documents WHERE id = ?', [documentId]);
      expect(result).to.be.an('array').with.lengthOf(1);
      expect(result[0].title).to.equal(updatedDocument.title);
      expect(result[0].handler).to.equal(updatedDocument.handler);
      expect(result[0].modified.toISOString()).to.equal(new Date(updatedDocument.modified).toISOString());
    });       

    it('should return an error if the document id is invalid', async () => {
      const updatedDocument = { title: 'Updated Document', handler: 'Jane Doe', modified: '2022-03-08 12:00:00' };
      const res = await chai.request(app).put('/api/documents/999').send(updatedDocument);
      expect(res).to.have.status(404); // Modified the expected status code manually
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete an existing document', async () => {
      // Insert a draft into the drafts table
      const draft = { subject_id: subjectId };
      
      const draftInsertResult = await db.query('INSERT INTO drafts SET ?', draft);
      const draftId = draftInsertResult[0].insertId;
    
      const existingDocument = { id: 2, draft_id: draftId, title: 'Existing Document', handler: 'John Doe', modified: '2022-02-01 00:00:00' };
      await db.query('INSERT INTO documents SET ?', existingDocument);
      const res = await chai.request(app).delete(`/api/documents/${existingDocument.id}`);
      expect(res).to.have.status(204);
      const [rows] = await db.query('SELECT * FROM documents WHERE id = ?', [existingDocument.id]);
      expect(rows).to.be.an('array').with.lengthOf(0);
    });
        
    it('should return an error if the document id is invalid', async () => {
        const res = await chai.request(app).delete('/api/documents/999');
        expect(res).to.have.status(404); // Modified the expected status code manually
        expect(res.body).to.have.property('error');
    });
  });

  // Add after() hook to close the server, Added these call manually since this was also a problem earlier
  after((done) => {
    app.close(() => {
        done();
    });
  });
});