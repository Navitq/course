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

const { User, Coll, sequelize, Op, Item } = require("./sequelize.js");
const s3 = require("./s3.js");

const app = express();

const middlware = session({
    resave: false,
    saveUninitialized: false,
    secret: "aaa2C44-4D44-WppQ38Siuyiuy",
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser("aaa2C44-4D44-WppQ38Siuyiuy"));

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

app.get("/s3drop", async (req, res) => {
    let url = await s3.generateUrl();
    res.send({ url });
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
    let result;
    try {
        result = await User.findAll({
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

    req.session.user_id = result[0].dataValues.user_id;
    req.session.save();
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
        let currentUser = await User.create({
            email: req.fields.email,
            username: req.fields.name,
            password: req.fields.password,
            img: req.fields.img,
            img_name: req.fields.img_name,
        });
        req.session.auth = true;
        req.session.user_id = currentUser.dataValues.user_id;
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
    if (!req.session.auth) {
        return;
    }
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
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.engine.use(middlware);

io.on("connection", (socket) => {
    const req = socket.request;
    console.log("hhhhhhhhhhhhh", socket.request.session.auth);

    socket.on("get_new_coll", async (data) => {
        if (!req.session.auth) {
            return;
        }
        let parsedData = JSON.parse(data);
        parsedData.uuid = socket.request.session.user_id;
        let currentUser = await Coll.create(parsedData);
        socket.emit("got_new_coll", JSON.stringify(currentUser));
    });

    socket.on("get_coll", async (data) => {
        if (!req.session.auth) {
            return;
        }
        try {
            let result = await Coll.findAll({
                where: {
                    uuid: req.session.user_id,
                },
            });
            socket.emit("got_coll", JSON.stringify(result));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_item", async (dataJSON) => {
        // if (!req.session.auth) {
        //     return;
        // }
        let data = JSON.parse(dataJSON);
        try {
            let result = await Item.create(data);
            socket.emit("got_item", JSON.stringify(result));
        } catch (err) {
            console.error(err);
        }
    });

    async function checkAccess(user_id, data) {
        try {
            let result = await Coll.findAll({
                where: {
                    col_id: data.col_id,
                },
            });
            let adminChecker = await User.findAll({
                where: {
                    user_id: result[0].dataValues.uuid,
                },
            });
            if (
                result[0].dataValues.uuid == user_id ||
                adminChecker[0].dataValues.status == "admin"
            ) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
        }
    }

    socket.on("change_item", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        if (
            !req.session.auth ||
            !(await checkAccess(req.session.user_id, data))
        ) {
            return;
        }
        await Item.update(data, {
            where: {
                item_id: data.item_id,
            },
        });
    });

    socket.on("delete_item", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        console.log(data, 666666666666666666666666666666);
        if (
            !req.session.auth ||
            !(await checkAccess(req.session.user_id, data))
        ) {
            return;
        }
        await Item.destroy({
            where: {
                item_id: data.item_id,
            },
        });
        socket.emit("delete_item");
    });

    socket.on("get_item_info", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        let resultColl, resultItems;
        try {
            resultColl = await Coll.findAll({
                where: {
                    col_id: data.col_id,
                },
            });

            resultItems = await Item.findAll({
                where: {
                    item_id: data.item_id,
                },
            });
            if(resultItems.length<1){
                socket.emit(
                    "got_item_info",
                    JSON.stringify({err:true})
                );
                return;
            }

            socket.emit(
                "got_item_info",
                JSON.stringify(resultColl[0]),
                JSON.stringify(resultItems[0])
            );
        } catch (err) {
            socket.emit(
                "got_item_info",
                JSON.stringify({err:true})
            );
        }
    });

    socket.on("get_user_data", async (data) => {
        if (!req.session.auth) {
            return;
        }
        try {
            let result = await User.findAll({
                where: {
                    user_id: req.session.user_id,
                },
            });
            socket.emit("got_user_data", JSON.stringify(result[0].dataValues));
        } catch (err) {
            console.error(err);
        }
    });
    socket.on("get_col_items", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        let resultColl = await Coll.findAll({
            where: {
                col_id: data.col_id,
            },
        });
        let resultItems = await Item.findAll({
            where: {
                col_id: data.col_id,
            },
        });
        socket.emit(
            "got_col_items",
            JSON.stringify(resultColl),
            JSON.stringify(resultItems)
        );
    });
});

server.listen(4000, async (req, res) => {});
