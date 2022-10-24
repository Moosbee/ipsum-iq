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

function DB_Output() {

    pool.query('SELECT * FROM user', (err, result, fields)=>{

        if(err) {
            return console.log(err);
        }
        var output = result
        return output;
    })

}