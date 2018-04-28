const express = require('express');
const app = express();
const handlebars = require('handlebars'),
  url = require('url'),
  db = require('./db_functions.js');
  

app.use(express.static('../client'));  //css and JS static files are served by express automatically
app.get('/', function (req, res) {
  const filePath = '/home/rama/workspace/Calendar_Updated/client/index.html';
  var readFile = function() {
    return new Promise(function(resolve, reject) {
      fs.readFile(filePath, function readContents(err, content) {
        return err ? reject(err) : resolve(content);
      });
    });
  }
  readFile().then(function(content) {
                res.writeHead(200, {'Content-type': 'text/html'});
                res.end(content, 'utf-8');
          })
          .catch(function(err) {
            console.log(err);
          });
          
});


app.get('/appointments', function (req, res) {
  db.retrieveAllAppointments()
    .then(function(content) {
      console.log('All appointments retrieved');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(content), 'utf-8');
    })
    .catch(function(err) {
      console.log(err);
    });
});

const server = app.listen(9000, () => console.log('Updated calendar app listening on port 9000!'));
module.exports = server;