let {Sequelize,Model,DataTypes,Op,QueryTypes} = require("sequelize")
let sequelizeCon = new Sequelize("Mysql://root:root@localhost/ecom")
sequelizeCon.authenticate().then(()=>{
    console.log("database connected successfully");
}).catch((err)=>{
    console.log("database not connected",err);
})
sequelizeCon.sync({alter : true})
module.exports = {
    sequelizeCon,
    Model,
    DataTypes,
    Op,
    QueryTypes
}