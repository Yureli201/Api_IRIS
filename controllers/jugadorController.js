const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.crearJugador = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { first_name, last_name, email, phone, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO jugador (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, username, hashedPassword]
    );
    res.status(201).json({ message: 'Jugador creado', id: result.insertId });
    console.log("Registro");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

exports.obtenerJugadores = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, username, created_at FROM jugador');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerJugadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, username, created_at FROM jugador WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Jugador no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerJugadorUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, username, created_at FROM jugador WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(404).json({ message: 'Jugador no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM jugador WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }

    const jugador = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, jugador.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const payload = { id: jugador.id, username: jugador.username };
    const token = jwt.sign(payload, 'clave_secreta_jwt', { expiresIn: '1h' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token: token,
    });
    console.log("Login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.actualizarJugador = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, username } = req.body;
  try {
    await db.execute(
      'UPDATE jugador SET first_name = ?, last_name = ?, email = ?, phone = ?, username = ? WHERE id = ?',
      [first_name, last_name, email, phone, username, id]
    );
    res.json({ message: 'Jugador actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarJugador = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM jugador WHERE id = ?', [id]);
    res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
