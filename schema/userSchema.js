let {sequelizeCon,Model,DataTypes,Data} = require("../init/dbconfig")
class User extends Model{}
User.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email_id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    contact : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    otp : {
        type : DataTypes.STRING,
        allowNull : true
    },
    token : {
        type : DataTypes.STRING(500),
        allowNull : true,
    },
    is_active : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: true
    },
    is_deleted : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue: false
    }
    
},{
    tableName : "user",
    modelName : "User",
    sequelize : sequelizeCon
})
module.exports = {User}
