const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');

router.post('/', progresoController.crearProgreso);
router.get('/', progresoController.obtenerTodos);
router.get('/top', progresoController.top10);
router.get('/:id_jugador', progresoController.obtenerPorJugador);
router.put('/:id_progreso', progresoController.actualizarProgreso);
router.delete('/:id_progreso', progresoController.eliminarProgreso);

module.exports = router;
