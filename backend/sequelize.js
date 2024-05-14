const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize("course", "navitq", "qwerty123", {
    dialect: "postgres",
});

checkConnection();
async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log("Соединение с БД было успешно установлено");
    } catch (e) {
        console.log("Невозможно выполнить подключение к БД: ", e);
        return;
    }
}

const User = sequelize.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    img_name: DataTypes.STRING,
    img: DataTypes.STRING,
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "basic",
        allowNull: false,
    },
});

const Coll = sequelize.define("collection", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    col_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    img: {
        type: DataTypes.STRING,
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    text0: {
        type: DataTypes.STRING,
    },

    text1: {
        type: DataTypes.STRING,
    },

    text2: {
        type: DataTypes.STRING,
    },

    number0: {
        type: DataTypes.STRING,
    },

    number1: {
        type: DataTypes.STRING,
    },

    number2: {
        type: DataTypes.STRING,
    },

    checkbox0: {
        type: DataTypes.STRING,
    },

    checkbox1: {
        type: DataTypes.STRING,
    },

    checkbox2: {
        type: DataTypes.STRING,
    },

    textarea0: {
        type: DataTypes.STRING,
    },

    textarea1: {
        type: DataTypes.STRING,
    },

    textarea2: {
        type: DataTypes.STRING,
    },

    date0: {
        type: DataTypes.STRING,
    },

    date1: {
        type: DataTypes.STRING,
    },

    date2: {
        type: DataTypes.STRING,
    },
});

const Item = sequelize.define("item", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    col_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    item_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },

    tags: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    img: {
        type: DataTypes.STRING,
    },

    likes:{ 
        type: DataTypes.INTEGER, 
    },

    text0: {
        type: DataTypes.STRING,
    },

    text1: {
        type: DataTypes.STRING,
    },

    text2: {
        type: DataTypes.STRING,
    },

    number0: {
        type: DataTypes.STRING,
    },

    number1: {
        type: DataTypes.STRING,
    },

    number2: {
        type: DataTypes.STRING,
    },

    checkbox0: {
        type: DataTypes.STRING,
    },

    checkbox1: {
        type: DataTypes.STRING,
    },

    checkbox2: {
        type: DataTypes.STRING,
    },

    textarea0: {
        type: DataTypes.STRING,
    },

    textarea1: {
        type: DataTypes.STRING,
    },

    textarea2: {
        type: DataTypes.STRING,
    },

    date0: {
        type: DataTypes.STRING,
    },

    date1: {
        type: DataTypes.STRING,
    },

    date2: {
        type: DataTypes.STRING,
    },
});

const Tag = sequelize.define("tag", {
    tag: DataTypes.STRING,
    tag_amount: DataTypes.INTEGER
});

// (async () => {
//     await sequelize.sync({ force: true });
//     let user = await User.build({ username: "1", email: "1@1", password: "1" });
//     await user.save();
// })();

module.exports = {
    User,
    Coll,
    Item,
    Tag,
    sequelize,
    Op,
};
