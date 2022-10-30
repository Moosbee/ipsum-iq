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

var admin_user = "test";
var admin_pwd;
var user;
var pwd; 

pool.query('SELECT username, password FROM user', (err, result, fields)=>{

    if(err) {
        return console.log(err);
    }
    //Ergebnise der Abfrage in Variablen speichern
    admin_user = result[0].username;
    admin_pwd = result[0].password;
    user = result[1].username;
    pwd = result[1].password;
    

    
   
})

//Variablen exportieren
module.exports = {
    admin_user,
    admin_pwd,
    user,
    pwd
};






