const express = require('express');
const app = express();
const handlebars = require('handlebars');
const mysql = require('mysql'),
  url = require('url'),
  db = require('./db_functions.js'),
  con = mysql.createConnection({
    host: 'localhost',
    user: 'custom',
    password: 'password',
    database: 'calendar_db'
  });

app.use(express.static('../client'));  //css and JS static files are served by express automatically
app.get('/', function (req, res) {
  const filePath = '/home/rama/workspace/Calendar_Updated/client/index.html';
  fs.readFile(filePath, function readContents(err, content) {
    if (err) {
      throw err;
    }
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(content, 'utf-8');
  });
});

app.get('/appointments', function (req, res) {
  db.data.retrieveAllAppointments(con, (err, rows) => {
    if (err) {
       throw err;
    }
    console.log('All appointments retrieved');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows), 'utf-8');
  });
});

const server = app.listen(9000, () => console.log('Updated calendar app listening on port 9000!'));
module.exports = server;