let userModel = require("../model/user")

async function createUser(request,response){
    let modelData = await userModel.create(request.body).catch((err)=>{
        return {error : err}
    })
    if(!modelData || (modelData && modelData.error)){
        let error = (modelData && modelData.error)?
        modelData.error : "internal server Error"
        return response.send({error})
    }
    return response.send({data : modelData.data})
}
module.exports = {createUser}