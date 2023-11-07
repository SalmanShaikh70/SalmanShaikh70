let {sequelizeCon,Model,DataTypes} = require("../init/dbconfig")
class Product extends Model{}
Product.init({
    id : {
       type : DataTypes.STRING,
       primaryKey : true,
       autoIncrement : true,
       allowNull : false 
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    price : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    is_active : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue :true,
    },
    is_deleted : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue : false
    }
},{
    tableName : "product",
    modelName : "Product",
    sequelize : sequelizeCon
})

module.exports = {Product}