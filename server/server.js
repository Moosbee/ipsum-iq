const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const database = require('./database');

const mysql = require('mysql2/promise');

const connInfo={
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ipsum_iq",
    connectionLimit: 10
}

const connection = mysql.createConnection(connInfo);



app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());


app.get('/login', (req, res) => {
  res.sendFile('/login.html', { root: __dirname });
});

app.post('/users', async (req, res) => {

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);

        const user = { name: req.body.name, password: hashedPassword };
        const query = `INSERT INTO user (username, password) VALUES ("${user.name}", "${user.password}")`;
        res.status(201).send("Successfully registered");
        
        database.pool.query(query, (err, result, fields) => {
            if (result) {
                return console.log(result);
            }
            else {
                return console.log(err);
            }
        });

    } catch {
        res.status(500).send("Fatal Error");
    }


});

app.post('/login', async (req, res) => {

    let an = await (await connection).query("SELECT username, password FROM user");

    console.log(an);

    if (an == null) {
        return res.status(400).send("Cannot find user");
    }
    try {
        if (await bcrypt.compare(req.body.password, an[0][0].password)) {
            res.send("Success");
        }
        else {
            res.send("Wrong User or Password");
        }
    } catch {
        res.status(500).send("Fatal error :(");
    }




});

app.listen(3000);