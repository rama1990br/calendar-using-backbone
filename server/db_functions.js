var methods = {};

methods.retrieveAllAppointments = function(con, callbackfn) {
  con.query('SELECT * FROM dummyTable', callbackfn);
};

exports.data = methods;