// target_timeframes.js

const db = require('./db');


function setupTargetTimeframesRoute(app) {
    app.post('/api/target_timeframes', async (req, res) => {
        const { draft_id, goal, planned_date, actual_date, comments, document_id, link_text } = req.body;
        try {
            const [result] = await db.query('INSERT INTO target_timeframes (draft_id, goal, planned_date, actual_date, comments, document_id, link_text) VALUES (?, ?, ?, ?, ?, ?, ?)', [draft_id, goal, planned_date, actual_date, comments, document_id, link_text]); // Destructure the result array here
            res.status(201).json({ id: result.insertId });
        } catch (err) {
            res.status(500).json({ error: 'Error creating target timeframes' });
        }
    });
    

    app.get('/api/target_timeframes/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM target_timeframes WHERE id = ?', [id]);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Target timeframes not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (err) {
            res.status(500).json({ error: 'Error retrieving target timeframes' });
        }
    });


    app.put('/api/target_timeframes/:id', async (req, res) => {
        const { id } = req.params;
        const { draft_id, goal, planned_date, actual_date, comments, document_id, link_text } = req.body;
        try {
            const result = await db.query('UPDATE target_timeframes SET draft_id = ?, goal = ?, planned_date = ?, actual_date = ?, comments = ?, document_id = ?, link_text = ? WHERE id = ?', [draft_id, goal, planned_date, actual_date, comments, document_id, link_text, id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Target timeframes not found' });
            } else {
                res.status(200).json({ message: 'Target timeframes updated successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error updating target timeframes' });
        }
    });
    

    app.delete('/api/target_timeframes/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db.query('DELETE FROM target_timeframes WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Target timeframes not found' });
            } else {
                res.status(200).json({ message: 'Target timeframes deleted successfully' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error deleting target timeframes' });
        }
    });
}

module.exports = setupTargetTimeframesRoute;
