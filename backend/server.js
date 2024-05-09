const express = require("express");
const formidable = require("express-formidable");
const db = require("./db");
const session = require("express-session");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const { emit } = require("process");
const { writeFile, readFile } = require("fs");


const app = express();
const middlware = session({
    resave: false,
    saveUninitialized: false,
    secret: "secretPsswrd",
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser("secretPsswrd"));

app.use(middlware);

const server = createServer(app);

app.get("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    res.json({ auth: false });
    return;
});

app.get("/sign_in", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    res.json({ auth: false });
    return;
});

app.post("/sign_in", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }

    try {
        const result = await db.query(
            `SELECT * from users WHERE email='${req.fields.email}' and password='${req.fields.password}'`
        );
        if (result.rowCount < 1) {
            res.status(401).send("Login or password error!");
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
    req.session.auth = true;
    req.session.email = req.fields.email;
    res.json({ auth: true });
    return;
});

app.post("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    try {
        const result = await db.query(
            `SELECT * from users WHERE email='${req.fields.email}'`
        );
        if (result.rowCount >= 1) {
            res.json({ auth: "This user is already registered" });
            return;
        }
    } catch (err) {
        console.error(err);
        es.status(500).send("Internal Server Error");
    }
    try {
        await db.query(
            `INSERT INTO users(email, userName, password) VALUES ('${
                req.fields.email
            }','${req.fields.name}','${req.fields.password}')`
        );
        req.session.auth = true;
        req.session.email = req.fields.email;

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
    res.json({ auth: true });
    return;
});

app.delete("/log_out", async (req, res) => {
    delete req.session.auth;
    req.session.destroy();
    res.json({ auth: false });
});

app.get("/categories", async (req, res) => {
    res.json(["stamps", "spoons", "rings", "books", "glasses", "coins", "cars", "trains", "plains", "hats", "other"]);
});

const io = new Server(server, {
    maxHttpBufferSize: 5e7,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.engine.use(middlware);


server.listen(4000, async (req, res) => {
    console.log("start")
    try {
        await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await db.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            user_id UUID DEFAULT Uuid_generate_v4 (),
            email  varchar not null UNIQUE,
            userName varchar not null,
            img_name varchar ,
            img_id varchar ,
            regDate  TIMESTAMPTZ,
            lastVisit varchar(64) ,
            password varchar not null
        )
        `);

    } catch (err) {
        console.error(err);
        //res.status(500).send("Internal Server Error");
        return;
    }
});