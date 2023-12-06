let category = require("../model/category")


async function createUi(request,response){
    return response.render("category/register")
}
async function create(request,response){
    let categoryData = await category.create(request.body,request.userData).catch((err)=>{
        return {error : err}
    })
    if(!categoryData || (categoryData && categoryData.error)){
        let error = (categoryData && categoryData.error) ? categoryData.error:"internal server error"
        return response.send({error})
    }   
    return response.send(categoryData.data)
}

async function viewAll(request,response){
    let categorys = await category.viewAll(request.query,request.userData.permissions).catch((err)=>{
        return {error : err}
    })
    if(!categorys || (categorys && categorys.error)){
        return response.render("category/view",{error : categorys.error})
    }

    return response.render("category/view",{category:categorys.data,total : categorys.total,page: categorys.page,limit:categorys.limit,permissions:request.userData.permissions})
}

async function viewDetail(request,response){
    let categorys = await category.viewDetail(request.params.id).catch((err)=>{
        return {error : err}
    })
    console.log("22",categorys);
    if(!categorys || (categorys && categorys.error)){
        return response.render("category/view",{error : categorys.error})
    }
    return response.render("category/details",{category : categorys.data})
}

async function updateUI(request,response){
    let categorys = await category.viewDetail(request.params.id).catch((err)=>{
        return {error : err}
    })
    if(!categorys || categorys && categorys.error){
        let url = (category && category.data && category.data.id) ? "/category" + category.data.id : "/category";
        return response.redirect(url)
    }
    return response.render("category/update",{category : categorys.data})
}

async function update(request,response){
    let categorys = await category.update(request.params.id,request.body,request.userData).catch((err)=>{
        return {error : err}
    })
    console.log("55",categorys);
    if(!categorys || (categorys && categorys.error)){
        let url = (category && category.data && category.data.id) ? "/category" + category.data.id:"/category"
        return response.redirect(url)
    }
    let url = (category && category.data && category.data.id) ? "/category" + category.data.id:"/category"

    return response.redirect(url)
}

async function cDelete(request,response){
    let categorys = await category.cDelete(request.params.id,true).catch((err)=>{
        return {error : err}
    })
    if(!categorys || (categorys && categorys.error)){
        let url = (request.params && request.params.id) ? "/category/" + request.params.id : "/category"
        return response.redirect(url)
    }
    return response.redirect("/category")

}


async function cRestore(request,response){
    let categorys = await category.cRestore(request.params.id,false).catch((err)=>{
        return {error : err}
    })
    if(!categorys || (categorys && categorys.error)){
        let url = (request.params && request.params.id) ? "/category" + request.params.id : "/category"
        return response.redirect(url)
    }
    return response.redirect("/category")
}
module.exports = {
    createUi,
    create,
    viewAll,
    viewDetail,
    updateUI,
    update,
    cDelete,
    cRestore
}