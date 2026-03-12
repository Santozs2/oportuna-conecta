const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const userId = req.query.user_id;
  db.query(
    'SELECT * FROM jobs WHERE user_id = ?',
    [userId],
    (err, jobs) => {
      if (err) return res.status(500).json({ error: err });

      const promises = jobs.map(j =>
        new Promise((resolve) => {
          db.query(
            'SELECT skill FROM job_skills WHERE job_id = ?',
            [j.id],
            (err, skills) => {
              resolve({ ...j, requiredSkills: skills.map(s => s.skill) });
            }
          );
        })
      );

      Promise.all(promises).then(result => res.json(result));
    }
  );
});

router.post('/', (req, res) => {
  const { user_id, title, company, location, salary, type, description, status, postedDate, requiredSkills } = req.body;

  db.query(
    'INSERT INTO jobs (user_id, title, company, location, salary, type, description, status, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [user_id, title, company, location, salary, type, description, status, postedDate],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const jobId = result.insertId;
      const skillValues = requiredSkills.map(s => [jobId, s]);

      db.query('INSERT INTO job_skills (job_id, skill) VALUES ?', [skillValues], () => {
        res.json({ id: jobId, ...req.body });
      });
    }
  );
});

module.exports = router;