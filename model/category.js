
let {Category} = require("../schema/categorySchema")
let joi = require("joi")


// ---------------------------------Create----------------------------


async function create(params,userData){

    // user data validation
    let valid = await checkValid(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    // check if category exist
    let find = await Category.findOne({where:{Name:params.name}}).catch((err)=>{
        return {error:err}
    })
    if(find){
        return {error : "Categories already Exist"}
    }
    

    // format data 

    let categoryData = {
        name : params.name,
        image : params.image,
        created_by : userData.id,
        updated_by : userData.id
    }

    // create category in db

    let data = await Category.create(categoryData).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal server error",status : 500}
    }

    //retutn category data

    return {data : data}
}


async function checkValid(data){
    let schema = joi.object({
        name : joi.string().min(6).max(50),
        image : joi.string().min(10).max(100)
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


// -------------------------------------- View All ----------------------------


async function viewAll(params,permissions){
    let limit = (params.limit)?parseInt(params.limit) : 10;
    let page = (params.page)?parseInt(params.page) : 10;
    let offset = (page - 1) * limit
    
    let where = {}
    if(!permissions.category_restore){
        where = {is_deleted : false}
    }

    let counter = await Category.count().catch((err)=>{
        return {error : err}
    })
    if(!counter || (counter && counter.error)){
        return {error : "Internal Server Error"}
    }
    if(counter <= 0){
        return {error : "Record Not found"}
    }

    let data = await Category.findAll({limit},{offset},{raw : true},where).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){  
        return {error : "Internal Server Error", status : 500}
    }

    return {data : data,total : counter,page,limit}
}
//------------------------------------view Details--------------------

async function viewDetail(id){
    let data = await Category.findOne({where:{id}}).catch((err)=>{
        return {error : err}
    })
    console.log(data);
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status: 500}
    }
    return {data}
}

//-------------------------Update -----------------------------------

async function update(id,params,userData){
    params.id = id;
    let valid = await checkUpdate(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let data = await Category.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

    data.name = params.name
    data.updated_by = userData.id

    let updateCategory = await Category.update(data,{where:{id}}).catch((err)=>{
        return {error : err}
    })
    if(!updateCategory || (updateCategory && updateCategory.error)){
        return {error : "Internal Server Error",status : 500}
    }

    return {data : data}

}


async function checkUpdate(data){
    let schema = joi.object({
        id : joi.number().required(),
        name : joi.string().min(6).max(50).required()
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

//------------------------------------ Delete -----------------------------------------

async function cDelete(id,desision){
    let valid = await checkDelete({id}).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let data = await Category.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

    if(data.is_deleted == desision){
        return {error : "Category already deleted"}
    }

    let updateCategory = await Category.update({is_deleted : desision},{where :{id}}).catch((err)=>{
        return {error : err}
    })
    if(!updateCategory || (updateCategory && updateCategory.error)){
        return {error : "Internal Server Error",status: 500}
    }

    if(updateCategory <= 0){
        return {error : "Record not deleted"}
    }

    return {data : "record successfully Deleted"}
}


async function cRestore(id,desision){
    let valid = await checkDelete({id}).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let data = await Category.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

    if(data.is_deleted == desision){
        return {error : "Category already deleted"}
    }

    let updateCategory = await Category.update({is_deleted : desision},{where :{id}}).catch((err)=>{
        return {error : err}
    })
    if(!updateCategory || (updateCategory && updateCategory.error)){
        return {error : "Internal Server Error",status: 500}
    }

    if(updateCategory <= 0){
        return {error : "Record not deleted"}
    }

    return {data : "record successfully Restored"}
}


async function checkDelete(data){
    let schema = joi.object({
        id : joi.number().required()
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
module.exports = {
    create,
    viewAll,
    viewDetail,
    update,
    cDelete,
    cRestore
}