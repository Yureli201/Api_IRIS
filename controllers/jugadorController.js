const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.crearJugador = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { first_name, last_name, email, phone, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [resJug] = await db.execute(
      'INSERT INTO jugador (first_name, last_name, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, username, hashedPassword]
    );
    const [resProg] = await db.execute(
          `INSERT INTO progresojugador (id_jugador, puntuacion, partidas_jugadas, partidas_ganadas, partidas_perdidas) 
           VALUES (?, ?, ?, ?, ?)`,
          [resJug.insertId, 0, 0, 0, 0]
     );
    res.status(201).json({ message: 'Jugador creado', id: resJug.insertId });
    console.log("Registro");
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error.message);
  }
};

exports.obtenerJugadores = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, username, password FROM jugador');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerJugadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, username, password FROM jugador WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Jugador no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerJugadorUsername = async (req, res) => {
  const { username } = req.params;
  console.log("Parámetro recibido:", username);
  try {
      const [rows] = await db.execute(
          'SELECT id, first_name, last_name, email, phone, username, password FROM jugador WHERE username = ?',
          [username]
      );
      console.log("Resultados de la consulta:", rows);
      if (rows.length === 0) {
          console.log("Jugador no encontrado");
          return res.status(404).json({ type: 'No encontrado', message: 'Jugador no encontrado' });
      }
      res.json(rows[0]);
  } catch (error) {
      console.error("Error en la consulta:", error.message);
      res.status(500).json({ error: error.message });
  }
};

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
      id: jugador.id,
      username: jugador.username
    });

    console.log("Login");
    console.log(res.json);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.actualizarJugador = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, password } = req.body;
  console.log("Datos recibidos:", req.params, req.body);
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'UPDATE jugador SET first_name = ?, last_name = ?, email = ?, phone = ?, username = ?, password= ? WHERE id = ?',
      [first_name, last_name, email, phone, username, hashedPassword, id]
    );
    res.json({ message: 'Jugador actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarJugador = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM progresojugador WHERE id_jugador = ?', [id]);
    await db.execute('DELETE FROM jugador WHERE id = ?', [id]);
    res.json({ message: 'Jugador eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
