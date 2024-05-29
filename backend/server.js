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

const {
    User,
    Coll,
    sequelize,
    Op,
    Item,
    Comment,
    Tag,
    Likes,
} = require("./sequelize.js");
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

async function addSession(session_id, user_id) {
    await User.update(
        {
            session_id: session_id,
        },
        {
            where: {
                [Op.or]: { user_id },
            },
        }
    );
}

app.get("/sign_up", formidable(), async (req, res) => {
    if (req.session.auth) {
        res.json({ auth: true });
        return;
    }
    res.json({ auth: false });
    return;
});

app.get("/s3drop", async (req, res) => {
    try {
        let url = await s3.generateUrl();
        res.send({ url });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
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
                [Op.or]: [{ status: "basic" }, { status: "admin" }],
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
    try {
        await addSession(req.session.id, req.session.user_id);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
    }
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
        await addSession(req.session.id, req.session.user_id);
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
    res.json({ auth: false });
    req.session.destroy();
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
87;

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

async function checkUserExisting(data) {
    if (!data) {
        return false;
    }
    let user = await User.findAll({
        where: {
            user_id: data,
        },
    });

    if (user.length < 1) {
        return false;
    } else {
        return false;
    }
}

io.engine.use(middlware);

io.on("connection", (socket) => {
    const req = socket.request;

    socket.on("get_new_coll", async (data, user_id) => {
        // if (!req.session.auth) {
        //     return;
        // }
        try {
            let parsedData = JSON.parse(data);
            let userState = checkUserExisting(user_id || req.session.user_id);
            if (!userState) {
                return;
            }

            if (
                ((await checkAdminStatus(req.session.user_id)) && user_id) ||
                (user_id == req.session.user_id && user_id)
            ) {
                parsedData.uuid = user_id;
                let currentUser = await Coll.create(parsedData);
                if (req.session.user_id == user_id) {
                    socket.emit(
                        "got_new_coll",
                        JSON.stringify(currentUser),
                        "all"
                    );
                    return;
                }
                socket.emit(
                    "got_new_coll",
                    JSON.stringify(currentUser),
                    "people"
                );
                return;
            }
            parsedData.uuid = socket.request.session.user_id;
            let currentUser = await Coll.create(parsedData);
            socket.emit("got_new_coll", JSON.stringify(currentUser), "private");
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("change_col_data", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        try {
            if (
                !req.session.auth ||
                !(await checkAccess(req.session.user_id, data))
            ) {
                return;
            }
            await Coll.update(data, {
                where: {
                    col_id: data.col_id,
                },
            });
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_coll", async (data) => {

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

    socket.on("get_person_coll", async (data) => {
        try {
            let result = await Coll.findAll({
                where: {
                    uuid: data,
                },
            });
            socket.emit("got_person_coll", JSON.stringify(result));
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
            if (!(await checkCollExisting(data))) {
                return;
            }
            let result = await Item.create(data);
            socket.emit("got_item", JSON.stringify(result));
            let tags = data.tags.split("#");
            tags.shift();
            tags = tags.map((el) => {
                return { tag: `#${el}` };
            });
            Tag.bulkCreate(tags);
        } catch (err) {
            console.error(err);
        }
    });

    async function checkCollExisting(data) {
        let result = await Coll.findAll({
            where: {
                col_id: data.col_id,
            },
        });
        if (result.length < 1) {
            return false;
        } else {
            return true;
        }
    }

    async function checkAccess(user_id, data) {
        if(!user_id){
            return false
        }
        let result = await Coll.findAll({
            where: {
                col_id: data.col_id,
            },
        });
        if (result.length < 1) {
            return false;
        }
        let adminChecker = await User.findAll({
            where: {
                user_id: user_id,
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
    }

    async function checkUser(user_id) {
        let adminChecker = await User.findAll({
            where: {
                user_id: user_id,
            },
        });
        if (adminChecker[0].dataValues.status == "admin") {
            return true;
        } else {
            return false;
        }
    }

    async function checkAdminStatus(user_id) {
        let admin = false;
        if (user_id) {
            admin = await checkUser(user_id);
        }
        return admin;
    }

    socket.on("delete_col_data", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        try {
            if (
                !req.session.auth ||
                !(await checkAccess(req.session.user_id, data))
            ) {
                return;
            }

            await Coll.destroy({
                where: {
                    col_id: data.col_id,
                },
            });

            await Item.destroy({
                where: {
                    col_id: data.col_id,
                },
            });

            socket.emit("delete_col_data");
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("change_item", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        try {
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
                individualHooks: true,
            });
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("delete_item", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        try {
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
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("old_comment", async (dataJSON) => {
        try {
            let data = JSON.parse(dataJSON);
            let newComment = await Comment.findAll({
                where: {
                    item_id: data.item_id,
                },
            });
            socket.emit(`${data.item_id}`, JSON.stringify(newComment));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_item_info", async (dataJSON) => {
        let owner = { owner: false };

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
            if (resultItems.length < 1) {
                socket.emit("got_item_info", JSON.stringify({ err: true }));
                return;
            }

            if (await checkAccess(req.session.user_id, data)) {
                owner = { owner: true };
            }

            socket.emit(
                "got_item_info",
                JSON.stringify(resultColl[0]),
                JSON.stringify(resultItems[0]),
                JSON.stringify(owner)
            );
        } catch (err) {
            console.log(err)
            socket.emit("got_item_info", JSON.stringify({ err: true }));
        }
    });

    socket.on("get_comment", async (dataJSON) => {
        if (!req.session.auth) {
            return;
        }
        let data = JSON.parse(dataJSON);
        try {
            let result = await User.findAll({
                where: {
                    user_id: req.session.user_id,
                },
            });
            data.username = result[0].dataValues.username;
            data.user_id = req.session.user_id;
            let newComment = await Comment.create(data);
            io.emit(`${data.item_id}`, JSON.stringify([newComment]));
        } catch (err) {
            console.error(err);
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

    socket.on("get_person_data", async (data) => {
        let owner = { owner: false };
        try {
            let result = await User.findAll({
                where: {
                    user_id: data,
                },
            });
            if (result.length < 1) {
                socket.emit("got_person_data", JSON.stringify({ err: true }));
            }

            if (
                (data == req.session.user_id && req.session.auth) ||
                (req.session.auth && (await checkUser(req.session.user_id)))
            ) {
                owner = { owner: true };
            }
            socket.emit(
                "got_person_data",
                JSON.stringify(result[0].dataValues),
                JSON.stringify(owner)
            );
        } catch (err) {
            socket.emit("got_person_data", JSON.stringify({ err: true }));
            console.error(err);
        }
    });

    socket.on("filter_coll", async (dataJSON, user_id) => {
        let data = JSON.parse(dataJSON);
        if (data.checkbox_img_only == true) {
            data.img = { [Op.ne]: null };
        }
        delete data.checkbox_img_only;

        try {
            let result = await Coll.findAll({
                where: data,
            });
            console.log(user_id)
            if(user_id && req.session.user_id != user_id){
                socket.emit("got_person_coll", JSON.stringify(result));
            } else {
                socket.emit("got_coll", JSON.stringify(result));
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("filter_items", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        if (data.checkbox_img_only == true) {
            data.img = { [Op.ne]: null };
        }
        delete data.checkbox_img_only;
        try {
            let result = await Item.findAll({
                where: data,
            });
            socket.emit("filtered_items", JSON.stringify(result));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_col_items", async (dataJSON) => {
        let data = JSON.parse(dataJSON);
        try {
            let owner = { owner: false };
            let resultColl = await Coll.findAll({
                where: {
                    col_id: data.col_id,
                },
            });
            if (resultColl.length < 1) {
                socket.emit("got_col_items", JSON.stringify({ err: true }));
                return;
            }
            let resultItems = await Item.findAll({
                where: {
                    col_id: data.col_id,
                },
            });

            if (await checkAccess(req.session.user_id, data)) {
                owner = { owner: true };
            }


            socket.emit(
                "got_col_items",
                JSON.stringify(resultColl),
                JSON.stringify(resultItems),
                JSON.stringify(owner)
            );
        } catch (err) {
            console.log(err)
            socket.emit("got_col_items", JSON.stringify({ err: true }));
        }
    });

    socket.on("get_last_items", async () => {
        try {
            let items = await Item.findAll({
                attributes: ["id", "col_id", "name", "item_id"],
                limit: 10,
                order: [["id", "DESC"]],
            });
            let colData = [];
            let compareData = [];
            for (let i = 0; i < items.length; ++i) {
                items[i].dataValues.nameItem = items[i].dataValues.name;
                delete items[i].dataValues.name;
                if (!colData.includes(items[i].dataValues.col_id)) {
                    colData.push(items[i].dataValues.col_id);
                    compareData.push({ col_id: items[i].dataValues.col_id });
                }
            }
            let collections = await Coll.findAll({
                attributes: ["uuid", "name", "col_id"],
                where: {
                    [Op.or]: compareData,
                },
            });
            colData = [];
            compareData = [];
            for (let i = 0; i < collections.length; ++i) {
                collections[i].dataValues.nameColl =
                    collections[i].dataValues.name;
                delete collections[i].dataValues.name;
                if (!colData.includes(collections[i].dataValues.uuid)) {
                    colData.push(collections[i].dataValues.uuid);
                    compareData.push({
                        user_id: collections[i].dataValues.uuid,
                    });
                }
            }
            let users = await User.findAll({
                attributes: ["user_id", "username"],
                where: {
                    [Op.or]: compareData,
                },
            });
            collections.forEach((el) => {
                for (let i = 0; i < users.length; ++i) {
                    if (el.dataValues.uuid == users[i].dataValues.user_id) {
                        delete el.dataValues.uuid;
                        for (const [key, value] of Object.entries(
                            users[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });
            items.forEach((el) => {
                for (let i = 0; i < collections.length; ++i) {
                    if (
                        el.dataValues.col_id == collections[i].dataValues.col_id
                    ) {
                        for (const [key, value] of Object.entries(
                            collections[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });
            socket.emit("got_last_items", JSON.stringify(items));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_largest_coll", async () => {
        try {
            let items = await Item.findAll({
                limit: 5,
                attributes: [
                    "col_id",
                    [sequelize.fn("COUNT", sequelize.col("col_id")), "count"],
                ],
                group: ["col_id"],
                having: sequelize.literal("count(col_id) > 0"),
                order: [
                    [sequelize.fn("COUNT", sequelize.col("col_id")), "DESC"],
                ],
            });
            let collectionId = [];
            let userId = [];
            for (let i = 0; i < items.length; ++i) {
                collectionId.push({ col_id: items[i].dataValues.col_id });
            }
            let collections = await Coll.findAll({
                where: {
                    [Op.or]: collectionId,
                },
            });
            for (let i = 0; i < collections.length; ++i) {
                userId.push({ user_id: collections[i].dataValues.uuid });
            }

            collections.forEach((el) => {
                for (let i = 0; i < items.length; ++i) {
                    if (el.dataValues.col_id == items[i].dataValues.col_id) {
                        el.dataValues.count = items[i].dataValues.count;
                        break;
                    }
                }
            });
            let users = await User.findAll({
                attributes: ["user_id", "username"],
                where: {
                    [Op.or]: userId,
                },
            });

            collections.forEach((el) => {
                for (let i = 0; i < users.length; ++i) {
                    if (el.dataValues.uuid == users[i].dataValues.user_id) {
                        for (const [key, value] of Object.entries(
                            users[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });

            socket.emit("got_largest_coll", JSON.stringify(collections));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_tags_cloud", async () => {
        try {
            let tags = await Tag.findAll({
                limit: 100,
                attributes: [
                    "tag",
                    [sequelize.fn("COUNT", sequelize.col("tag")), "count"],
                ],
                group: ["tag"],
                having: sequelize.literal("count(tag) > 0"),
                order: [[sequelize.fn("COUNT", sequelize.col("tag")), "DESC"]],
            });
            socket.emit("got_tags_cloud", JSON.stringify(tags));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("items_by_tag", async (data) => {
        try {
            let items = await Item.findAll({
                where: {
                    [Op.or]: [
                        {
                            tags: {
                                [Op.like]: `%${"#" + data + "#"}%`,
                            },
                        },
                        {
                            tags: {
                                [Op.endsWith]: `${"#" + data}`,
                            },
                        },
                    ],
                },
            });

            let collectionId = [];
            for (let i = 0; i < items.length; ++i) {
                items[i].dataValues.nameItem = items[i].dataValues.name;
                delete items[i].dataValues.name;
                if (!collectionId.includes(items[i].dataValues.col_id)) {
                    collectionId.push({ col_id: items[i].dataValues.col_id });
                }
            }

            let collections = await Coll.findAll({
                attributes: ["uuid", "name", "col_id"],
                where: {
                    [Op.or]: collectionId,
                },
            });
            let userId = [];
            for (let i = 0; i < collections.length; ++i) {
                collections[i].dataValues.nameColl =
                    collections[i].dataValues.name;
                delete collections[i].dataValues.name;
                if (!userId.includes(collections[i].dataValues.col_id)) {
                    userId.push({ user_id: collections[i].dataValues.uuid });
                }
            }

            let users = await User.findAll({
                attributes: ["user_id", "username"],
                where: {
                    [Op.or]: userId,
                },
            });

            collections.forEach((el) => {
                for (let i = 0; i < users.length; ++i) {
                    if (el.dataValues.uuid == users[i].dataValues.user_id) {
                        for (const [key, value] of Object.entries(
                            users[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });

            items.forEach((el) => {
                for (let i = 0; i < collections.length; ++i) {
                    if (
                        el.dataValues.col_id == collections[i].dataValues.col_id
                    ) {
                        for (const [key, value] of Object.entries(
                            collections[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });
            socket.emit("items_by_tag", JSON.stringify(items));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("check_admin_status", async () => {
        try {
            let admin = await checkAdminStatus(req.session.user_id);

            socket.emit("checked_admin_status", admin);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("admin_user_list", async () => {
        try {
            if (!(await checkAdminStatus(req.session.user_id))) {
                return;
            }

            let result = await User.findAll();

            socket.emit("admin_user_listed", JSON.stringify(result));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("block_admin", async (dataJSON) => {
        try {
            let data = JSON.parse(dataJSON);

            if (!(await checkAdminStatus(req.session.user_id))) {
                return;
            }

            await User.update(
                {
                    status: "block",
                },
                {
                    where: {
                        [Op.or]: data,
                    },
                }
            );

            let users = await User.findAll({
                where: {
                    [Op.or]: data,
                },
            });

            for (let i = 0; i < users.length; i++) {
                req.sessionStore.destroy(
                    users[i].dataValues.session_id,
                    (err, script) => {}
                );
            }

            socket.emit("request_success");
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("unblock_admin", async (dataJSON) => {
        try {
            let data = JSON.parse(dataJSON);

            if (!(await checkAdminStatus(req.session.user_id))) {
                return;
            }

            await User.update(
                {
                    status: "basic",
                },
                {
                    where: {
                        [Op.or]: data,
                    },
                }
            );

            socket.emit("request_success");
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("admin_admin", async (dataJSON) => {
        try {
            let data = JSON.parse(dataJSON);

            if (!(await checkAdminStatus(req.session.user_id))) {
                return;
            }

            await User.update(
                {
                    status: "admin",
                },
                {
                    where: {
                        [Op.or]: data,
                    },
                }
            );

            socket.emit("request_success");
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("delete_admin", async (dataJSON) => {
        try {
            let data = JSON.parse(dataJSON);

            if (!(await checkAdminStatus(req.session.user_id))) {
                return;
            }

            let users = await User.findAll({
                attributes: ["user_id", "session_id"],
                where: {
                    [Op.or]: data,
                },
            });

            let userColl = [];

            for (let i = 0; i < users.length; i++) {
                userColl.push({ uuid: users[i].dataValues.user_id });
                req.sessionStore.destroy(
                    users[i].dataValues.session_id,
                    (err, script) => {}
                );
            }

            let collections = await Coll.findAll({
                attributes: ["col_id"],
                where: {
                    [Op.or]: userColl,
                },
            });

            let colColl = [];

            for (let i = 0; i < collections.length; i++) {
                colColl.push(collections[i].dataValues);
            }

            await Item.destroy({
                where: {
                    [Op.or]: colColl,
                },
            });

            await Coll.destroy({
                where: {
                    [Op.or]: userColl,
                },
            });

            await User.destroy({
                where: {
                    [Op.or]: data,
                },
            });

            socket.emit("request_success");
        } catch (err) {
            console.log(err);
            socket.emit("request_unsuccess");
        }
    });

    socket.on("get_tags_coll", async () => {
        try {
            let tagsColl = await Tag.findAll({
                attributes: [
                    [sequelize.fn("DISTINCT", sequelize.col("tag")), "tag"],
                ],
            });
            socket.emit("got_tags_coll", JSON.stringify(tagsColl));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("get_search", async (data) => {
        try {
            let unicodeNum = null;
            let language = "en";
            for (let i = 0; i < data.length; ++i) {
                if (/[А-Яа-я]/.test(data[i])) {
                    language = "ru";
                    break;
                } else if (/[A-Za-z]/.test(data[i])) {
                    language = "en";
                    break;
                }
            }
            let items = null;

            if (language == "ru") {
                items = await Item.findAll({
                    limit: 50,
                    attributes: {
                        include: [
                            [
                                sequelize.fn(
                                    "ts_rank",
                                    sequelize.col("item_search_russian"),
                                    sequelize.literal(
                                        `plainto_tsquery('${data}')`
                                    )
                                ),
                                "rank",
                            ],
                        ],
                    },
                    where: {
                        item_search_russian: {
                            [Op.match]: sequelize.literal(
                                `plainto_tsquery('${data}')`
                            ),
                        },
                    },
                    order: [[sequelize.literal("rank"), "DESC"]],
                });
            } else {
                items = await Item.findAll({
                    limit: 50,
                    attributes: {
                        include: [
                            [
                                sequelize.fn(
                                    "ts_rank",
                                    sequelize.col("item_search_english"),
                                    sequelize.literal(
                                        `plainto_tsquery('${data}')`
                                    )
                                ),
                                "rank",
                            ],
                        ],
                    },
                    where: {
                        item_search_english: {
                            [Op.match]: sequelize.literal(
                                `plainto_tsquery('${data}')`
                            ),
                        },
                    },
                    order: [[sequelize.literal("rank"), "DESC"]],
                });
            }

            let collectionId = [];
            for (let i = 0; i < items.length; ++i) {
                items[i].dataValues.nameItem = items[i].dataValues.name;
                delete items[i].dataValues.name;
                if (!collectionId.includes(items[i].dataValues.col_id)) {
                    collectionId.push({ col_id: items[i].dataValues.col_id });
                }
            }

            let collections = await Coll.findAll({
                attributes: ["uuid", "name", "col_id"],
                where: {
                    [Op.or]: collectionId,
                },
            });
            let userId = [];
            for (let i = 0; i < collections.length; ++i) {
                collections[i].dataValues.nameColl =
                    collections[i].dataValues.name;
                delete collections[i].dataValues.name;
                if (!userId.includes(collections[i].dataValues.col_id)) {
                    userId.push({ user_id: collections[i].dataValues.uuid });
                }
            }

            let users = await User.findAll({
                attributes: ["user_id", "username"],
                where: {
                    [Op.or]: userId,
                },
            });

            collections.forEach((el) => {
                for (let i = 0; i < users.length; ++i) {
                    if (el.dataValues.uuid == users[i].dataValues.user_id) {
                        for (const [key, value] of Object.entries(
                            users[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });

            items.forEach((el) => {
                for (let i = 0; i < collections.length; ++i) {
                    if (
                        el.dataValues.col_id == collections[i].dataValues.col_id
                    ) {
                        for (const [key, value] of Object.entries(
                            collections[i].dataValues
                        )) {
                            el.dataValues[`${key}`] = value;
                        }
                    }
                }
            });

            socket.emit("got_search", JSON.stringify(items));
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("new_like", async (itemId) => {
        itemId = JSON.parse(itemId);
        if (!req.session.auth) {
            return;
        }
        itemId.user_id = req.session.user_id;
        let likes = await Likes.findAll({
            where: {
                [Op.and]: [itemId],
            },
        });
        if (likes.length < 1) {
            await Likes.create(itemId);
        } else {
            await Likes.destroy({
                where: {
                    [Op.and]: [itemId],
                },
            });
        }
        socket.emit("new_like", JSON.stringify(itemId));
    });

    socket.on("get_like", async (itemIdJSON) => {
        let itemId = JSON.parse(itemIdJSON)
        let userLiked = false;

        let likes = await Likes.findAll({
            where: {
                item_id: itemId.item_id,
            },
        });
        if (req.session.user_id) {
            itemId.user_id = req.session.user_id;
            let user = await Likes.findAll({
                where: {
                    [Op.and]: [itemId]
                },
            });
            if (user.length > 0) {
                userLiked = true;
            }
        }
        socket.emit(
            "got_like",
            JSON.stringify({
                count: likes.length,
                liked: userLiked,
                item_id: itemId.item_id,
            })
        );
    });
});

server.listen(4000, async (req, res) => {});
