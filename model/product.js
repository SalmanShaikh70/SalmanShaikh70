let {Product} = require("../schema/productSchema")
let joi = require("joi")

async function create(params){
    let valid = await check(params).catch((err)=>{
        return {error : err}

    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }
    let productData = {
        name : params.name,
        price : params.rate,
        description : params.desc,
    }
    let data = await Product.create(productData).catch((err)=>{
        return {error : err}
    })
    console.log(data)
    if(!data || (data && data.error)){
        console.log("data",data)
        return {error : "internal server error"}
    }
    return {data : data}
}


async function check(data){
    let schema = joi.object({
        name: joi.string().min(3).max(20).required(),
        rate: joi.number().required(),
        desc: joi.string().min(10).max(50).required(),
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


async function viewAll(params,permissions){
    let limit = (params.limit)?parseInt(params.limit) : 10;
    let page = (params.page)?parseInt(params.page) : 1;
    let offset = (page - 1) * limit 

    let where = {};
    if(!permissions.product_restore){
        where = {is_deleted:false}
    }

    let counter = await Product.count({where}).catch((err)=>{
        return {error : err}
    })
    
    if(!counter || (counter && counter.error)){
        return {error : "Internal server error"}
    }
    if(counter <= 0){
        return {error : "Record not found"}
    }
    
    let data = await Product.findAll({limit,offset,raw:true,where}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal server error", status : 500}
    }
    return {data : data, total : counter,page,limit}
}

async function viewDetail(id){
    let data = await Product.findOne({where:{id}}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal server error", status : 500}
    }
    return {data};
}

async function checkUpdate(data){
       let schema = joi.object({
        id:joi.number().required(),
        name: joi.string().min(3).max(20),
        rate: joi.number(),
        desc: joi.string().min(10).max(50),
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
async function update(id,params){
    params.id = id;
    //user data validation
    let valid = await checkUpdate(params).catch((error)=>{ return {error}; });
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }
    //check product in db
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal server error", status : 500}
    }

    //format product data
    data.name = params.name;
    data.price = params.rate;
    data.description = params.desc;
    
    //update record in db
    let updateProduct = await Product.update(data,{where:{id}}).catch((error)=>{ return {error} });
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error : "Internal server error", status : 500}
    }
    
    return {data:data}
}

async function checkDelete(data){
    let schema = joi.object({
        id:joi.number().required(),
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
async function pDelete(id,desision){
    //user data validation
    let valid = await checkDelete({id}).catch((error)=>{ return {error}; });
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    //check if product exist
    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal server error", status : 500}
    }

    //check if product is already delete
    if(data.is_deleted == true){
        return {error: "Product is already deletee."}
    } 

    //update product table
    let updateProduct = await Product.update({is_deleted:desision},{where:{id}}).catch((error)=>{ return {error} });
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error : "Internal server error", status : 500}
    }

    if(updateProduct <= 0){
        return {error:"record not deleted"}
    }

    //return data
    return {data:"record sucessfully deleted"}
}


async function pRestore(id,desision){
    //user data validation
    let valid = await checkDelete({id}).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    //check if product exist

    let data = await Product.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

     //check if product is not delete

    if(data.is_deleted == desision){
        return {error : "product is not deleted"}
    }

      //update product table

    let updateProduct = await Product.update({is_deleted : desision},{where : {id}}).catch((err)=>{
        return {error : err}
    })
    if(!updateProduct || (updateProduct && updateProduct.error)){
        return {error : "Internal Server Error", status : 500}
    }
    if(updateProduct <= 0){
        return {error : "record not deleted"}
    }

    //return data

    return {data : "record successfully restore"}
    
}

module.exports={
    create,
    viewAll,
    viewDetail,
    update,
    pDelete,
    pRestore
}



