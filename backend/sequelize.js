const session = require("express-session");
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
    session_id: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING(1024),
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
        type: DataTypes.STRING(1024),
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
        type: DataTypes.BOOLEAN,
    },

    checkbox1: {
        type: DataTypes.BOOLEAN,
    },

    checkbox2: {
        type: DataTypes.BOOLEAN,
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

    item_search_english: {
        type: DataTypes.TSVECTOR,
    },

    item_search_russian: {
        type: DataTypes.TSVECTOR,
    },
}, {
    hooks: {
        beforeCreate: (item, options) => {
            const concatenatedText = sequelize.fn('concat_ws', ' ', item.name, item.col_id, item.tags, item.description, item.img, item.text0, item.text1, item.text2, item.number0, item.number1, item.number2, item.textarea0, item.textarea1, item.textarea2, item.date0, item.date1, item.date2);
            item.item_search_english = sequelize.fn('to_tsvector', 'english', concatenatedText);
            item.item_search_russian = sequelize.fn('to_tsvector', 'russian', concatenatedText);
        },
        beforeUpdate: (item, options) => {
            const concatenatedText = sequelize.fn('concat_ws', ' ', item.name, item.col_id, item.tags, item.description, item.img, item.text0, item.text1, item.text2, item.number0, item.number1, item.number2, item.textarea0, item.textarea1, item.textarea2, item.date0, item.date1, item.date2);
            item.item_search_english = sequelize.fn('to_tsvector', 'english', concatenatedText);
            item.item_search_russian = sequelize.fn('to_tsvector', 'russian', concatenatedText);
        }
    }
});

const Tag = sequelize.define("tag", {
    tag: DataTypes.STRING
});

const Token = sequelize.define("token", {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

const Likes = sequelize.define("like", {
    item_id: DataTypes.STRING,
    user_id: DataTypes.STRING
});

const Comment = sequelize.define("comment", {
    comment_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
    },

    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    col_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    item_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    comment: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },

    date: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },


});

(async () => {
    // await sequelize.sync();//{ force: true }
    //let user = await User.build({ username: "1", email: "1@1", password: "1", status: 'admin' });
    // await user.save();
    // sequelize.sync({ alter: true })

})();

module.exports = {
    Likes,
    User,
    Coll,
    Item,
    Tag,
    sequelize,
    Op,
    Comment,
    Token
};
