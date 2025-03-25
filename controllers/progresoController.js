const db = require('../db');

exports.obtenerTodos = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM progresojugador`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.top10 = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT j.username, p.*
       FROM progresojugador p
       INNER JOIN jugador j ON j.id = p.id_jugador
       ORDER BY p.puntuacion DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorJugador = async (req, res) => {
  const { id_jugador } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM progresojugador WHERE id_jugador = ?`,[id_jugador]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Progreso no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarProgreso = async (req, res) => {
  const { id_progreso } = req.params;
  const { puntuacion, partidas_jugadas, partidas_ganadas, partidas_perdidas } = req.body;
  try {
    await db.execute(
      `UPDATE progresojugador 
       SET puntuacion = ?, partidas_jugadas = ?, partidas_ganadas = ?, partidas_perdidas = ? 
       WHERE id_progreso = ?`,
      [puntuacion, partidas_jugadas, partidas_ganadas, partidas_perdidas, id_progreso]
    );
    res.json({ message: 'Progreso actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

