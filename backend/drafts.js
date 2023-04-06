// drafts.js

const db = require('./db');

function setupDraftsRoute(app) {
  app.post('/api/drafts', async (req, res) => {
    const { subject_id } = req.body;
    try {
        const result = await db.query('INSERT INTO drafts (subject_id) VALUES (?)', [subject_id]);
        res.status(201).json({ id: result[0].insertId });
    } catch (err) {
        res.status(500).json({ error: 'Error creating draft' });
    }
  });


  app.get('/api/drafts', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM drafts');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching drafts' });
    }
  });


  app.get('/api/drafts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT drafts.id, drafts.subject_id, inspection_information.* FROM drafts JOIN inspection_information ON drafts.id = inspection_information.draft_id WHERE drafts.id = ?', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Draft not found' });
      } else {
        res.json(rows[0]);
      }
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving draft' });
    }
  });


  app.delete('/api/drafts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM drafts WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Draft not found' });
      } else {
        res.status(200).json({ message: 'Draft deleted successfully' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error deleting draft' });
    }
  });

  app.get('/api/drafts/:id/full', async (req, res) => {
    const { id } = req.params;
    try {
      // Fetch draft and its inspection information
      const [draftRows] = await db.query('SELECT drafts.id, drafts.subject_id, inspection_information.* FROM drafts JOIN inspection_information ON drafts.id = inspection_information.draft_id WHERE drafts.id = ?', [id]);
      if (draftRows.length === 0) {
        res.status(404).json({ error: 'Draft not found' });
        return;
      }

      // Fetch target timeframes
      const [targetTimeframes] = await db.query('SELECT * FROM target_timeframes WHERE draft_id = ?', [id]);

      // Fetch documents
      const [documents] = await db.query('SELECT * FROM documents WHERE draft_id = ?', [id]);

      // Fetch scheduling
      const [scheduling] = await db.query('SELECT * FROM scheduling WHERE draft_id = ?', [id]);

      // Combine data into a single response object
      const draft = {
        ...draftRows[0],
        target_timeframes: targetTimeframes,
        documents: documents,
        scheduling: scheduling,
      };

      res.json(draft);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving full draft information' });
    }
  });


}

module.exports = setupDraftsRoute;
