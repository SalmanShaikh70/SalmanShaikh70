let{sequelizeCon,Model,DataTypes} = require("../init/dbconfig")
class Permission extends Model{}
Permission.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    }
},{
   tableName : "permission",
   modelName : "Permission",
   sequelize : sequelizeCon 
})

module.exports = {Permission}

