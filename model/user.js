let {User} = require("../schema/userSchema")
let joi = require("joi")

async function create(params){
    let valid = await check(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }
    let userData = {
        name : params.username,
        email_id : params.email,
        contact : params.phone,
        password : params.password
    }
    let data = await User.create(userData).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        console.log("data",data)
        return {error : "internal server error"}
    }
    return {data : data}
}

async function check(data){
    let schema = joi.object({
        username: joi.string().min(3).max(20).required(),
        phone: joi.number().required(),
        email: joi.string().min(10).max(50).required(),
        password: joi.string().min(8).max(20).required()
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        let errMsg = []
        for(let i of valid.error.details){
            errMsg.push(i.message)
        }
        return {error : errMsg}
    }
    return {data : valid}
}

module.exports={create}