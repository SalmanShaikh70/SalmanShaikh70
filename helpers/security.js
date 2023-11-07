let jwt = require("jsonwebtoken")
let bcrypt = require("bcrypt")

function encrypt(text,key){
    return new Promise((resolve,reject)=>{
        jwt.sign(text,key,(err,token)=>{
            if(err){return reject(err)}
            return resolve(token)
        })
    })
}

function decrypt(token,key){
    return new Promise((resolve,reject)=>{
        jwt.verify(token,key,(errr,decrypt)=>{
            if(errr){return reject(errr)}
            return resolve(decrypt)          
        })
    })
}

async function hash(PT,salt=10){
    let encrypt = await bcrypt.hash(PT,salt).catch((err)=>{
        return {error : err}
    })
    if(!encrypt || (encrypt && encrypt.error)){
        return {error : encrypt.error}
    }
    return {data : encrypt}
}

async function compare(PT,ET){
    let check = await bcrypt.compare(PT,ET).catch((err)=>{
        return {error : err}
    })
    console.log("compare",check)
    if(!check || (check && check.error)){
        return {error:check && check.error ? check.error : true}
    }
    return {data : true}
}

module.exports={
    encrypt,
    decrypt,
    hash,
    compare
}
