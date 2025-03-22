const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jugadorRoutes = require('./routes/jugadorRoutes');
const progresoRoutes = require('./routes/progresoRoutes');

app.use('/jugadores', jugadorRoutes);
app.use('/progreso', progresoRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
