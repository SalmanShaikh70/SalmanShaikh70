let {sequelizeCon,QueryTypes} = require("../init/dbconfig")
let security = require("../helpers/security")

function auth(permission){
    return async (request,response,next)=>{
        let token = request.session.token
        if(typeof(token) != "string"){
            return response.redirect("/login?msg=unauthorized")
        }
        let decrypt = await security.decrypt(token,"!#$98@").catch((err)=>{
            return {error : err} 
        })
        if(!decrypt || (decrypt && decrypt.error)){
            console.log(decrypt.error)
            return response.redirect("/login?msg=unauthorized")
        }
        let query = `select user.id,user.name,p.name as permission
        from user 
        left join userpermission as up on user.id = up.user_id 
        left join permission as p on up.permission_id = p.id 
        where user.id ='${decrypt.id}' and
        token = '${token}'`;
        let user = await sequelizeCon.query(query,{type:QueryTypes.SELECT}).catch((err)=>{
            return {error : err}
        })

        if(!user || (user && user.error)){
            return response.redirect("/login?msg=Internal Server Error")
        }
        let permissions = {}
        for(let i of user){
            if(i.permission){
                permissions[i.permission] = true
            }
        }
        if(permissions.length <= 0 || !permissions[permission]){
            return response.redirect("/login?msg= Not authorized")
        }
        request.userData = {
            name : user[0].name,
            id : user[0].id,
            permissions
        }

        next();
    }
} 

module.exports = {auth}

