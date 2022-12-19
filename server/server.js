const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser")
const store = new session.MemoryStore();
const cors = require('cors');

const mysql = require('mysql2/promise');
const connInfo={
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ipsum_iq",
    connectionLimit: 10
}
const connection = mysql.createConnection(connInfo);

app.use(session({
    secret:'secretkey',
    cookie: {maxAge: 3000},
    saveUninitialized: false,
    resave: false,
    store
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json());

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET", "POST"],
    credentials: true
}));


app.get('/login', (req, res) => {
    if(req.session.authenticated) {
        if(req.session.user === "admin") {
            res.send({LoggedIn: true, user: req.session.user});
        }
        else if (req.session.user === "user") {
            res.send({LoggedIn: true, user: req.session.user});
        }    
    }
    else {
        res.send({LoggedIn: false});
    }
});

app.get('/', (req, res) => {
    console.log(store);
    res.send("test");
});

//Register Code
app.post('/users', async (req, res) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);

        const user = { name: req.body.name, password: hashedPassword };
        const query = `INSERT INTO user (username, password) VALUES ("${user.name}", "${user.password}")`;
        res.status(201).send("Successfully registered");
        
        connection.pool.query(query, (err, result, fields) => {
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

//Login Code
app.post('/login', async (req, res) => {

    let an = await (await connection).query("SELECT username, password FROM user");
    let isAdmin = req.body.name === an[0][0].username;
    let isAdminPassword = await bcrypt.compare(req.body.password, an[0][0].password);
    let isUser = req.body.name === an[0][1].username;
    let isUserPassword = await bcrypt.compare(req.body.password, an[0][1].password);

    if (an) {
        if(isAdmin && isAdminPassword) {
            req.session.authenticated = true;
            req.session.user = an[0][0].username;
            res.send({message: req.session.user});
            console.log("Admin Cookie set");
        }

        else if(isUser && isUserPassword) {
            req.session.authenticated = true;
            req.session.user = an[0][1].username;
            res.send({message: req.session.user});
            console.log("User Cookie set");
        }
            
        else {
            res.send({message: "Wrong Username or Password"});
        }
    }
    else {
        res.status(500).send("Fatal error :(");
    }

});

app.listen(3001);