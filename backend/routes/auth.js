const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
    [name, email, hash, type || 'admin'],
    (err, result) => {
      if (err) {
        console.log('Erro ao cadastrar:', err.message);
        return res.status(400).json({ error: err.message });
        }

      const id = result.insertId;
      const token = jwt.sign({ id }, process.env.JWT_SECRET);

      res.json({ token, id, name, email, type: type || 'admin' });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token, id: user.id, name: user.name, email: user.email, type: user.type });
  });
});

module.exports = router;