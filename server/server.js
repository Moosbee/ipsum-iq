const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser")
const store = new session.MemoryStore();
const cors = require('cors');
const http = require('http');
const url = require('url');
const server = http.createServer(app);
const Websocket = require("ws");
const { Server } = require("socket.io");
const wss = new Websocket.Server({ port: 8080, clientTracking: true,  });
const IO = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "ws://localhost:3000"]

    }
});

let ESPArray = [{

name: 'Wohnzimmer',
on: false,
},
{

    name: 'Schlafzimmer',
    on: false,
    },

]
/* let ESPArray = () => {
    let ESPArray = [];
    wss.clients.forEach(ws => {
        if(ws.isAlive) {
            ESPArray.push({ name: ws.id, on: ws.status });
        }
        
    })
    return ESPArray;
} */


const mysql = require('mysql2/promise');
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



app.post('/time', (req, res) => {

    if(req.session.user) {
        let hours = req.body.ledhours
        let minutes = req.body.ledminutes

        let sumHours = hours + minutes/60
        
        if(hours > 0 && minutes > 0) {
            wss.clients.forEach(ws => {
                if(ws.id == req.body.ESP) {
                    setTimeout(()=> {
                        ws.send("off");
                    }, sumHours * 3600000)
                }
            });
        }
        else {
            res.status(500).send("Invalid Number");
        }
    }
    else {
        res.send({LoggedIn: false});
    } 
});

app.post("/clear", async (req, res) => {

    if(req.session.user) {
        let query = "DELETE FROM eintraege;"
        (await connection).query(query);
        res.send({LoggedIn: true});
    }
    else {
        res.send({LoggedIn: false});
    }
});

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

        let array = ESPArray;

        for (let i = 0; i < array.length; i++) {

            if (req.body.ledname == array[i].name) {

                array[i].on = !array[i].on

                if (array[i].on) {
                    status = "an";

                }
                else if (array[i].on == false) {
                    status = "aus";
                }

            }
        }

        const InsertQuery = `INSERT INTO eintraege (Datum, Zeitpunkt, user, licht, Status) VALUES ("${date}", "${time}", "${user}", "${licht}", "${status}")`;
        // let an = await (await connection).query('INSERT INTO eintraege (Datum, Zeitpunkt, licht, user, Status) VALUES ("${date}", "${time}", "${licht}", "${user}", "${status}")');
        (await connection).query(InsertQuery);

        res.send({LoggedIn: true});

    }
    else {
        res.send({ LoggedIn: false });
    }

});

app.post('/state', (req, res) => {
    if (req.session.user) {
        let name = req.body.ledname;

        wss.clients.forEach(ws => {
            if(name == ws.id) {
                ws.send("toggle");
            }
        })

        res.send({LoggedIn: true});
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
        res.status(500).send("Error");
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
            
        }

        else if (isUser && isUserPassword) {
            req.session.authenticated = true;
            req.session.user = an[0][1].username;
            res.send({ message: req.session.user });
            console.log("User Cookie set");
            
        }

        else {
            res.send({ message: "Wrong Username or Password" });
        }
    }
    else {
        res.status(500).send("Fatal error :(");
    }

});

app.post('/logout', (req, res) => {

    if (req.session.user) {
        req.session.destroy(() => {
            res.send({ LoggedOut: true });
        })
    }
    else {
        res.send({LoggedOut: false});
    }
});

//Websocket Server -> ESP Code

function heartbeat () {
    this.isAlive = true;
}
wss.on('connection', (ws, req) => {

    console.log("Client connected");
    let pathname = url.parse(req.url);

    console.log(pathname.path.substring(1));

    ws.isAlive = true;
    ws.id = pathname.path.substring(1);
    ws.status = false;

    IO.emit("ledstate", { Message: ESPArray() });
    
    ws.on('pong', heartbeat);

    ws.on('message', message => {
        // if (message.type === "utf8") {
        console.log("Received Message: " + message);
        // let msg = JSON.parse(message.utf8Data)
        let msg;


        try {
            msg = JSON.parse(message)
        }
        catch (e) {
            console.log(e);
            return
        }


        if (msg.status == 0) {
            ws.status = false;
            console.log("LED1: " + ws.status);

        }
        else if (msg.status == 1) {
            ws.status = true;
            console.log("LED1: " + ws.status);


        }
        else {
            ws.send("Invalid message");
        }

        IO.emit("ledstate", { Message: ESPArray });

    });
})

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        return ws.terminate();
    }
  
      ws.isAlive = false;
      ws.ping();
    });

  }, 30000 * 2 * 5);

  
  wss.on("close", function close() {
    console.log("client disconnected");
    clearInterval(interval);
    IO.emit("ledstate", { Message: ESPArray });
})

//SocketIo Server zu Frontend Code

IO.on('connection', (socket) => {

    console.log('a user connected');

    socket.emit("ledstate", { Message: ESPArray });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


server.listen(3001, () => {
    console.log("Listening on Port 3001");
});