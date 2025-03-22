const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.post('/register', jugadorController.crearJugador);
router.post('/login', jugadorController.login);
router.get('/', jugadorController.obtenerJugadores);
router.get('/:id', jugadorController.obtenerJugadorPorId);
router.put('/:id', jugadorController.actualizarJugador);
router.delete('/:id', jugadorController.eliminarJugador);

module.exports = router;
