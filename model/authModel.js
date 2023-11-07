let{User} = require("../schema/userSchema")
let joi = require("joi")
let security = require("../helpers/security")
let {UP} = require("../schema/userPermissionSchema")
let generate = require("otp-generator")
let {mail} = require("../helpers/mailer")


async function register(params){
    //user data validation
    let validate = await userValidate(params).catch((err)=>{
        return {error : err}
    })
    if(!validate || (validate && validate.error)){
        return {error : validate.error}
    }

    //find if user exist in db
    let findUser = await User.findOne({where:{email_id : params.email}}).catch((err)=>{
        return {error : err}
    })
    if(findUser){
        return {error : "user already exists"}
    }
     
    // encrypt the password
    let hashPassword = await security.hash(params.password).catch((err)=>{
        return {error : err}
    })
    console.log("hash",hashPassword)
    if(!hashPassword || (hashPassword && hashPassword.error)){
        return {error : "Internal server Error"}
    }

    //format user data
    let UserData = {
        name : params.username,
        email_id : params.email,
        contact : params.phone,
        password : hashPassword.data
    }

    //insert into db
    let data = await User.create(UserData).catch((err)=>{
        return {error : err}
    })
    console.log(data)
    if(!data || (data && data.error)){
        return {error : "Internal server Error"}
    }
    
    //format user permission data
    let userpermission = {
        user_id : data.id, 
        permission_id : 1
    }

    //insert user permission into db
    let UpData = await UP.create(userpermission).catch((err)=>{
        return {error : err}
    })
    if(!UpData || (UpData && UpData.error)){
        return {error : "Internal server Error"}
    }
    return {data : data}
}

async function userValidate(data){
    let scheme = joi.object({
        username : joi.string().min(5).max(50).required(),
        email : joi.string().min(10).max(60).required(),
        phone : joi.number().required(),
        password : joi.string().min(5).max(20).required()
    })
    let valid = await scheme.validateAsync(data).catch((err)=>{
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


// ----------------------- login --------------------------


async function userLogin(params){

    //user login validation
    let validation = await loginValidation(params).catch((err)=>{
        return {error : err}
    })
    // console.log(validation)
    if(!validation || (validation && validation.error)){
        return {error : validation.error}
    }

   //check if user exist in db

   let userData = await User.findOne({where : {email_id : params.email}}).catch((err)=>{
    return {error : err}
   })
   if(!userData  || (userData && userData.error)){
    return {error : "user doesn't exist"}
   }
   //compare if user password match db password
 
   let match = await security.compare(params.password,userData.password).catch((error)=>{return {error}});
   if(!match || (match && match.error)){
       return {error : "wrong password"}
    }
    
    //generate token using jwt
    let userToken = await security.encrypt({id:userData.id},"!#$98@").catch((err)=>{
        return {error : err}
    })
    if(!userToken || (userToken && userToken.error)){
        return {error : "Internal server error"}
    }
    
    //update the token in user table against user_id
    
    let updateToken = await User.update({token:userToken},{where:{id : userData.id}}).catch((err)=>{
        return {error : err}
    })
   if(!updateToken || (updateToken && updateToken.error)){
    return {error : "Internal server error"}
   }
   return {token:userToken};
}

async function loginValidation(data){
    let schema = joi.object({
        email : joi.string().min(10).max(60).required(),
        password : joi.string().min(5).max(20).required(),
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


// ------------------------------- Forgot Password-------------------------------

async function forgotPassword(params){

    // joi validation for email
    let valid = await emailValid(params).catch((err)=>{
        return {error : err}
    })
    console.log(valid);
    if(!valid || (valid && valid.error)){
        return {error : "email not valid"}
    }

    // find user using email

    let findUser = await User.findOne({where : {email_id : params.email}}).catch((err)=>{
        return {error : err}
    })
    if(!findUser || (findUser && findUser.error)){
        return {error : "user didn't exist"}
    }

    // create otp using (otp generator)

    let otp = await generate.generate(6,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false})
    
    if(!otp || (otp && otp.error)){
        return {error : "Internal server error"}
    }

    // hash the otp

    let hashOtp = await security.hash(params.email) .catch((err)=>{
        return {error : err}
    })
    if(!hashOtp || (hashOtp && hashOtp.error)){
        return {error : "Internal server error"}
    }

    //save otp in database by user_id

    let saveOtp = await User.update({otp:hashOtp.data},{where: {id:findUser.id}}).catch((err)=>{
        return{error : err}
    })
    if(!saveOtp || (saveOtp && saveOtp.error)){
        return {error : "internal server error"}
    }

    //send mail by mailer function and send otp in text

    let mailOption = {
        from : "salmanshaikhsar123kar@gmail.com",
        to : params.email,
        subject : "mail testing",
        text : `this is your :- ${otp} please don't share with others`
    }

    let sendMail = await mail(mailOption).catch((err)=>{
        return {error : err}
    })
    if(!sendMail || (sendMail && sendMail.error)){
        return {error : "mail is not send"}
    }

    //return data

    return {data : `mail is send to ${params.email} `}
}

async function emailValid(data){
    let schema = joi.object({
        email : joi.string().email().min(10).max(60).required()
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

module.exports= {
    register,
    userLogin,
    forgotPassword
}

