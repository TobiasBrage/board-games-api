const db = require('../config/sql').connect();

module.exports = {
    'getOne': function(data) {
        db.query(`select * from bolche`, function (err, data) {
            return JSON.stringify(data);
        })
    }
};