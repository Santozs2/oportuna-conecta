const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.query.user_id;
  db.query(
    'SELECT * FROM candidates WHERE user_id = ?',
    [userId],
    (err, candidates) => {
      if (err) {
        console.log('Erro ao buscar candidatos:', err.message);
        return res.status(500).json({ error: err.message });
      }

      if (candidates.length === 0) return res.json([]);

      let completed = 0;
      const result = [];

      candidates.forEach((c) => {
        db.query(
          'SELECT skill FROM candidate_skills WHERE candidate_id = ?',
          [c.id],
          (err, skills) => {
            result.push({
              ...c,
              skills: skills ? skills.map((s) => s.skill) : [],
            });
            completed++;
            if (completed === candidates.length) {
              res.json(result);
            }
          }
        );
      });
    }
  );
});

router.post('/', (req, res) => {
  const { user_id, name, email, phone, location, program, completionDate, availability, skills } = req.body;

  db.query(
    'INSERT INTO candidates (user_id, name, email, phone, location, program, completion_date, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, name, email, phone, location, program, completionDate, availability],
    (err, result) => {
      if (err) {
        console.log('Erro ao inserir candidato:', err.message);
        return res.status(500).json({ error: err.message });
      }

      const candidateId = result.insertId;

      if (!skills || skills.length === 0) {
        return res.json({ id: candidateId, ...req.body, skills: [] });
      }

      const skillValues = skills.map((s) => [candidateId, s]);
      db.query('INSERT INTO candidate_skills (candidate_id, skill) VALUES ?', [skillValues], (err) => {
        if (err) {
          console.log('Erro ao inserir skills:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: candidateId, ...req.body });
      });
    }
  );
});

module.exports = router;