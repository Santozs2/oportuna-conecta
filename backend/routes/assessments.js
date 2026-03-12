const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.query.user_id;
  db.query(
    `SELECT a.* FROM assessments a
     JOIN candidates c ON a.candidate_id = c.id
     WHERE c.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

router.post('/', (req, res) => {
  const { candidate_id, skill, status, technical_score, psychological_score, total_score } = req.body;

  db.query(
    'INSERT INTO assessments (candidate_id, skill, status, technical_score, psychological_score, total_score) VALUES (?, ?, ?, ?, ?, ?)',
    [candidate_id, skill, status, technical_score, psychological_score, total_score],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

module.exports = router;