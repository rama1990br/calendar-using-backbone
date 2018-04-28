const mysql = require('mysql'),
  con = mysql.createConnection({
    host: 'localhost',
    user: 'custom',
    password: 'password',
    database: 'calendar_db'
  });

var methods = {};


methods.retrieveAllAppointments = function() {
   return new Promise(function(resolve, reject) {
   	  con.query('SELECT * FROM dummyTable', function retrieveAppointments(err, content) {
   	  	 return err ? reject(err) : resolve(content);
   	  });
   });
};

module.exports = methods;