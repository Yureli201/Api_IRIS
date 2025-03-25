const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');

router.get('/', progresoController.obtenerTodos);
router.get('/top', progresoController.top10);
router.get('/:id_jugador', progresoController.obtenerPorJugador);
router.put('/:id_progreso', progresoController.actualizarProgreso);

module.exports = router;
