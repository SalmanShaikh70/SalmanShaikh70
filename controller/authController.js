let authModel = require("../model/authModel")

async function register(request,response){
    let modelData = await authModel.register(request.body).catch((err)=>{
        return {error : err}
    })
    if(!modelData || (modelData && modelData.error)){
        let error = (modelData && modelData.error)?
        modelData.error : "Internal server Error"
        return response.send({error})
    }
    return response.redirect("/?msg=success");
}

async function login(request,response){
    let loginData = await authModel.userLogin(request.body).catch((err)=>{
        return {error : err}
    })
    if(!loginData || (loginData && loginData.error)){
        let error = (loginData && loginData.error)?
        loginData.error : "Internal Server Error"
        return response.send({error})
    }
    request.session.token = loginData.token
    return response.redirect("/dashboard");
}

async function index(request,response){
    response.render("regLog",{})
}

async function forgetPassUi(request,response){
    response.render("forgetPassword",{})
}

async function forgetPass(request,response){
    let forgetData = await authModel.forgotPassword(request.body).catch((err)=>{
        return {error : err}
    })
    if(!forgetData || (forgetData && forgetData.error)){
        let error = (forgetData && forgetData.error)?
        forgetData.error : "Internal Server Error"
        return response.send(({error}))
    }
    return response.send({data : forgetData})
}
module.exports ={
    register,
    login,
    index,
    forgetPass,
    forgetPassUi
}