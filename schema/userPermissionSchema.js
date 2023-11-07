let{sequelizeCon,Model,DataTypes} = require("../init/dbconfig")
class UP extends Model{}
UP.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    user_id: {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    permission_id :{
        type : DataTypes.INTEGER,
        allowNull : false
    }
},{
    tableName : "userPermission",
    modelName : "UP",
    sequelize : sequelizeCon
})

module.exports = {UP}