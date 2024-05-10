const express = require("express");
const formidable = require("express-formidable");
const session = require("express-session");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const { emit } = require("process");
const { writeFile, readFile } = require("fs");

const { User, sequelize, Op } = require("./sequelize.js");
const s3 = require("./s3.js")

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

app.get("/s3drop", async (req,res)=>{
    let url = await s3.generateUrl();
    res.send({url})
})

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
        const result = await User.findAll({
            where: {
                [Op.and]: [
                    { email: req.fields.email },
                    { password: req.fields.password },
                ],
            },
        });
        if (result.length < 1) {
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
        const result = await User.findAll({
            where: {
                email: req.fields.email,
            },
        });
        if (result.length >= 1) {
            res.json({ auth: "exist" });
            return;
        }
    } catch (err) {
        console.error(err);
        es.status(500).send("Internal Server Error");
    }
    try {
        await User.create({
            email: req.fields.email,
            username: req.fields.name,
            password: req.fields.password,
        });

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
    res.json([
        "stamps",
        "spoons",
        "rings",
        "books",
        "glasses",
        "coins",
        "cars",
        "trains",
        "plains",
        "hats",
        "other",
    ]);
});

const io = new Server(server, {
    maxHttpBufferSize: 5e7,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.engine.use(middlware);

io.on("connect", (socket) => {
    const req = socket.request;
    socket.on("newColl", (data) => {
        console.log(req.email)
        let parsedData = JSON.parse(data);
        console.log(parsedData)
    });
});

server.listen(4000, async (req, res) => {
    console.log("start");
});
