const { Sequelize, DataTypes, Op } = require('sequelize')

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
    img_id: DataTypes.STRING,
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
    }, 
    status:{
        type: DataTypes.STRING,
        defaultValue: "basic",
        allowNull: false
    }

});


(async () => {

    await sequelize.sync({ force: true });
    let user = await User.build({ username: '1', email:"1@1", password:"1"});
    await user.save()
})();





module.exports = {
    User,
    sequelize,
    Op
};