const { 
    createPool
} = require('mysql');

const pool = createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"ipsum_iq",
    connectionLimit: 10
})




pool.query('SELECT username, password FROM user', (err, result, fields)=>{

    if(err) {
        return console.log(err);
    }

    return result;
   
});

module.exports = {
    pool
}



