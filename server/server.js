const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser")
const store = new session.MemoryStore();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const Websocket = require("ws");
const { Server } = require("socket.io");
const wss = new Websocket.Server({ port: 8080 });
const IO = new Server(server, {
    cors: {
        origin:["http://localhost:3000", "ws://localhost:3000"]

    }
});

let led1state = false;
let led2state = false;

let ESPArray = [{
    name: "ESP1",
    on: led1state
},
{
    name:"ESP2",
    on: led2state
}]

const mysql = require('mysql2/promise');
const { client } = require('websocket');
const connInfo = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ipsum_iq",
    connectionLimit: 10
}
const connection = mysql.createConnection(connInfo);

app.use(session({
    secret: 'secretkey',
    cookie: { maxAge: 1000 * 60 * 10 },
    saveUninitialized: false,
    resave: false,
    store,

}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "http://10.0.0.5:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.get('/entries', async (req, res) => {

    let queryresult = await (await connection).query("SELECT user, Zeitpunkt, Licht, Status, Datum FROM eintraege ORDER BY eintraege_id DESC LIMIT 15;");

    if (req.session.user) {
        if (req.session.user == "admin") {
            res.send({ LoggedIn: true, result: queryresult, isAdmin: true });
        }
        else {
            res.send({ LoggedIn: true, isAdmin: false })
        }
    }
    else {
        res.send({ LoggedIn: false });
    }

});

app.post('/entries', async (req, res) => {

    
    if (req.session.user) {

        console.log("USER: " + req.session.user);
        let date_ob = new Date();

        let day = ("0" + date_ob.getDate()).slice(-2);


        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);


        let year = date_ob.getFullYear();


        let hours = date_ob.getHours();


        let minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);


        let seconds = date_ob.getSeconds();

        let date = day + "-" + month + "-" + year;
        let time = hours + ":" + minutes;

        let user = req.session.user;
        let licht = req.body.ledname;
        let status;

    
        for(let i = 0; i < ESPArray.length; i++) {

            if(req.body.ledname == ESPArray[i].name) {

                ESPArray[i].on = !ESPArray[i].on

                if(ESPArray[i].on) {
                    status = "an";
                    
                }
                else if(ESPArray[i].on == false) {
                    status = "aus";
                }   
               
            }
        }
        

        console.log("DATUM: " + date + " UHRZEIT: " + time + " USER: " + user[0][0].user_id);

        const InsertQuery = `INSERT INTO eintraege (Datum, Zeitpunkt, user, licht, Status) VALUES ("${date}", "${time}", "${user}", "${licht}", "${status}")`;
        // let an = await (await connection).query('INSERT INTO eintraege (Datum, Zeitpunkt, licht, user, Status) VALUES ("${date}", "${time}", "${licht}", "${user}", "${status}")');
        (await connection).query(InsertQuery);

    }
    else {
        res.send({ LoggedIn: false });
    }
    
});

app.post('/state', (req, res) => {

    if (req.session.user) {
        if(req.body.ledname == "ESP1") {
            led1state = !led1state
            console.log("DEINE MUTTER LED1" + led1state)
        }
        else if (req.body.ledname == "ESP2") {
            led2state = !led2state
            console.log("DEINE MUTTER LED2 " + led2state)

            
        }
    }
    else {

        res.send({ LoggedIn: false });
    }

});

app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        if (req.session.user === "admin") {
            res.send({ LoggedIn: true, user: req.session.user });
        }
        else if (req.session.user === "user") {
            res.send({ LoggedIn: true, user: req.session.user });
        }
    }
    else {
        res.send({ LoggedIn: false });
    }
});

app.get('/Mainpage', (req, res) => {

    if (req.session.user) {
        res.send({ LoggedIn: true });
    }
    else {
        res.send({ LoggedIn: false });
    }

});

// Register Code
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
        if (isAdmin && isAdminPassword) {
            req.session.authenticated = true;
            req.session.user = an[0][0].username;
            res.send({ message: req.session.user });
            console.log("Admin Cookie set");
            console.log(req.session.user);
        }

        else if (isUser && isUserPassword) {
            req.session.authenticated = true;
            req.session.user = an[0][1].username;
            res.send({ message: req.session.user });
            console.log("User Cookie set");
            console.log(req.session.user);
        }

        else {
            res.send({ message: "Wrong Username or Password" });
        }
    }
    else {
        res.status(500).send("Fatal error :(");
    }

});


//Websocket Server -> ESP Code

wss.on('connection', ws => {
    console.log("Client connected");

    ws.on('message', message => {
        // if (message.type === "utf8") {
            console.log("Received Message: " + message);
            // let msg = JSON.parse(message.utf8Data)

            if (message == "0") {
                led1state = false;
                console.log(led1state);
                
                
            }
            else if (message == "1") {
                led1state = true;
                console.log(led1state);
                
            }
            else {
                ws.send("Invalid message");
            }

        });

        ws.send("toggle")
            

    ws.on("close", () => {
        console.log("Client disconnected");
    })
})

//SocketIo Server zu Frontend Code

IO.on('connection', (socket) => {

    console.log('a user connected');
    
    socket.on("test_message", (data) => {
        console.log("THIS IS THE DATA: " + data.message);
      })

    
    socket.emit("ledstate", {Message: ESPArray});

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});



server.listen(3001, () => {
    console.log("Listening on Port 3001");
});