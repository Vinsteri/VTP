// documents.js

const db = require('./db');

function setupDocumentsRoute(app) {
  app.post('/api/documents', async (req, res) => {
    const { draft_id, title, handler, modified } = req.body;
    try {
      const results = await db.query(
        'INSERT INTO documents (draft_id, title, handler, modified) VALUES (?, ?, ?, ?)',
        [draft_id, title, handler, modified]
      );
      res.status(201).json({ id: results.insertId, draft_id, title, handler, modified });
    } catch (error) {
      res.status(500).json({ error: 'Error creating document' });
    }
  });

  app.get('/api/documents', async (req, res) => {
    try {
      const results = await db.query('SELECT * FROM documents');
      res.json(results);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Error fetching documents' });
    }
  });

  app.put('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    const { draft_id, title, handler, modified } = req.body;
    try {
      const existingDocument = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
      if (existingDocument.length === 0) {
        res.status(404).json({ error: `Document with id ${id} not found` });
        return;
      }
      await db.query(
        'UPDATE documents SET draft_id = ?, title = ?, handler = ?, modified = ? WHERE id = ?',
        [draft_id, title, handler, modified, id]
      );
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error updating document with id ${id}:`, error);
      res.status(500).json({ error: `Error updating document with id ${id}` });
    }
  });

  app.delete('/api/documents/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const existingDocument = await db.query('SELECT * FROM documents WHERE id = ?', [id]);
      if (existingDocument.length === 0) {
        res.status(404).json({ error: `Document with id ${id} not found` });
        return;
      }
      await db.query('DELETE FROM documents WHERE id = ?', [id]);
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error deleting document with id ${id}:`, error);
      res.status(500).json({ error: `Error deleting document with id ${id}` });
    }
  });
}

module.exports = setupDocumentsRoute;
