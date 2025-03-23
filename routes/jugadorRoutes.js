const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugadorController');

router.post('/registrar', jugadorController.crearJugador);
router.post('/login', jugadorController.login);
router.get('/buscarTodos', jugadorController.obtenerJugadores);
router.get('/buscar/:id', jugadorController.obtenerJugadorPorId);
router.get('/buscarUs/:username', jugadorController.obtenerJugadorUsername);
router.put('/actualizar/:id', jugadorController.actualizarJugador);
router.delete('/eliminar/:id', jugadorController.eliminarJugador);

module.exports = router;
