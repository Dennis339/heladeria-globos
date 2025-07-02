const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');

// Conexión a la base de datos
const db = require('./config/db');

// Rutas del proyecto
const pedidosRutas = require('./routes/pedidosRoutes');


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: false }));
const bonificacionesRoutes = require('./routes/bonificacionesRoutes');
app.use('/', bonificacionesRoutes);
const clientesRoutes = require('./routes/clientesRoutes');
app.use('/', clientesRoutes);

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Usar las rutas del módulo pedido
app.use('/', pedidosRutas);

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});