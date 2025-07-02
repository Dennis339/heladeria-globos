const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'heladoglobosdb'
})

connection.connect( (error) => {
    if (error) {
        console.log("NO se logro la conexion", error);
    } else {
        console.log("Se conecto exitosamente");
    }
});
module.exports = connection;