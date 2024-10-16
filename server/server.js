const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const store = new session.MemoryStore();
const cors = require('cors');
const mysql = require('mysql2/promise');
const { clearInterval } = require('timers');
const http = require('http');
const url = require('url');
const server = http.createServer(app);
const Websocket = require("ws");
const wss = new Websocket.Server({ port: 8080, clientTracking: true, });
const { Server } = require("socket.io");
const IO = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "ws://localhost:3000"]

    }
});




let ESPArray = () => {
    let ESPArray = [];
    wss.clients.forEach(ws => {
        if (ws.isAlive) {
            ESPArray.push({ name: ws.id, on: ws.status, time: ws.time, futureTime: ws.futureTime });
        }

    })
    return ESPArray;
}

const connInfo = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "ipsum_iq",
    connectionLimit: 10
}
const connection = mysql.createConnection(connInfo);

app.use(cookieParser())
app.use(session({
    secret: 'aSAieSJfieimnfsiosI',
    cookie: { maxAge: 1000 * 60 * 10 },
    saveUninitialized: false,
    resave: false,
    store,

}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "http://10.0.0.5:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

function ClearTime(name) {

    wss.clients.forEach(ws => {
        if (ws.id == name) {
            clearTimeout(ws.timer);
            ws.futureTime = 0;
            IO.emit("ledstate", { Message: ESPArray() })

        }
    })
}


app.post('/time', (req, res) => {

    let hours = +req.body.ledhours;
    let minutes = +req.body.ledminutes;
    let date = new Date().getTime();

    if (req.session.user) {
        wss.clients.forEach(ws => {
            if (ws.id == req.body.ESPName) {
                ws.time = (hours * 60 + minutes) * 60 * 1000
        
                ws.futureTime = date + ws.time;
                if(ws.status == false) {
                    ws.futureTime = 0;
                    IO.emit("ledstate", { Message: ESPArray() })
                }
                else {
                    ws.timer = setTimeout(() => {

                        ws.send("off");
                       
                    }, ws.time)
                    IO.emit("ledstate", { Message: ESPArray() })
                }
            }
        })
        res.send({ LoggedIn: true })
    }
    else {
        res.send({ LoggedIn: false });
    }
});

app.post('/timeclear', (req, res) => {

    if (req.session.user) {
        ClearTime(req.body.ESPName);
        res.send({ LoggedIn: true });
    }
    else {
        res.send({ LoggedIn: false });
    }
})
app.post("/clear", async (req, res) => {

    if (req.session.user) {

        let an = await (await connection).query("DELETE FROM eintraege");
        console.log(an);
        res.send({ LoggedIn: true });


    }
    else {
        res.send({ LoggedIn: false });
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



app.post('/state', async (req, res) => {
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

        wss.clients.forEach(ws=> {
            if (licht == ws.id) {
                if (ws.status) {
                    status = "aus";
                }
                else if (ws.status == false) {
                    status = "an";
                }
                ws.send("toggle");
            }
        })

        const InsertQuery = `INSERT INTO eintraege (Datum, Zeitpunkt, user, licht, Status) VALUES ("${date}", "${time}", "${user}", "${licht}", "${status}")`;
        (await connection).query(InsertQuery);
        
        res.send({ LoggedIn: true });
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

app.get('/About', (req, res) => {
    if (req.session.user) {
        res.send({ LoggedIn: true });
    }
    else {
        res.send({ LoggedIn: false });
    }
});

app.get('/Mainpage', (req, res) => {

    if (req.session.user) {
        res.send({ LoggedIn: true, User: req.session.user });
    }
    else {
        res.send({ LoggedIn: false });
    }

});

// Register Code
app.post('/register', async (req, res) => {
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
    let isUser;
    let isPassword;
    let login;

    if (an) {
        for(let i = 0; i < an[0].length; i++) {

            isPassword = await bcrypt.compare(req.body.password, an[0][i].password);
            isUser = req.body.name === an[0][i].username;

            if(isUser && isPassword) {

                req.session.authenticated = true;
                req.session.user = an[0][i].username;
                login = true;
                break;
            }
            else {
                 login = false;  
            }
        }

        if(login) {
            res.send({ message: req.session.user, LoggedIn: true });
        }
        else if(login == false) {
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
        res.send({ LoggedOut: false });
    }
});

//Websocket Server -> ESP Code

function heartbeat() {
    this.isAlive = true;
}
wss.on('connection', (ws, req) => {

    let pathname = url.parse(req.url);
    ws.isAlive = true;
    ws.id = pathname.path.substring(1);
    ws.status = false;
    ws.time;
    ws.timer;
    ws.futureTime = 0;

    IO.emit("ledstate", { Message: ESPArray() });

    ws.on('pong', heartbeat);

    ws.on('message', message => {
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
            ws.futureTime = 0;
            clearTimeout(ws.timer);
            
        }
        else if (msg.status == 1) {
            ws.status = true;
    
        }
        else {
            ws.send("Invalid message");
        }
        IO.emit("ledstate", { Message: ESPArray() });
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
    IO.emit("ledstate", { Message: ESPArray() });
})

//SocketIo Server zu Frontend Code

IO.on('connection', (socket) => {

    console.log('a user connected');

    socket.emit("ledstate", { Message: ESPArray() });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


server.listen(3001, () => {
    console.log("Listening on Port 3001");
});