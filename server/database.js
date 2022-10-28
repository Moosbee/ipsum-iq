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
    //Ergebnise der Abfrage in Variablen speichern
    var admin_user = result[0].username;
    var admin_pwd = result[0].password;
    var user = result[1].username;
    var pwd = result[1].password;
    
    console.log(admin_user);
    
    //Variablen exportieren
    module.exports = {
        admin_user,
        admin_pwd,
        user,
        pwd
    };
})





