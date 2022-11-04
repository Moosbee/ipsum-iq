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


async function database_output(username, passwd) {
    
    console.log(username);
    console.log(passwd);
}

database_output().then(pool.query('SELECT username, password FROM user', (err, result, fields)=>{

    if(err) {
        return console.log(err);
    }
    //Ergebnise der Abfrage in Variablen speichern

    var plsgeh = result;
    console.log(plsgeh);

    return plsgeh;
   
}));




//Variablen exportieren
module.exports = {
    database_output
};






