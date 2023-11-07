let product = require("../model/product")

async function addUI(req,res){
    return res.render('product/add')
}

async function add(req,res){
    let modelData = await product.create(req.body).catch((err)=>{
        return {error : err}
    })

    if(!modelData || (modelData && modelData.error)){
        let error = (modelData && modelData.error)?
        modelData.error : "internal server Error"
        return res.redirect('/product/create?msg=error')
    }
    console.log("here")
    return res.redirect('/product')
}



async function viewAll(request,response){
    let products = await product.viewAll(request.query,request.userData.permissions).catch((err)=>{
        return {error : err}
    }) 
    
    console.log("view",products.error);
    if(!products || (products && products.error)){
        return response.render("product/view",{error : products.error})
    }
    console.log("produc",products)
    return response.render("product/view",{product : products.data, total : products.total, page : products.page, limit : products.limit,permissions: request.userData.permissions})
}

async function viewDetail(req,res){
    let products = await product.viewDetail(req.params.id).catch((err)=>{
        return {error : err}
    }) 
    if(!products || (products && products.error)){
        return res.render("product/view",{error : products.error})
    }
    
    return res.render("product/details",{product : products.data})
}

async function updateUI(req,res){
    let products = await product.viewDetail(req.params.id).catch((err)=>{
        return {error : err}
    }) 
    
    console.log("product",products);
    if(!products || (products && products.error)){
        let url = (product && product.data && product.data.id) ? '/product/'+product.data.id:'/product';
        return res.redirect(url);
    }

    return res.render('product/update',{product:products.data})
}

async function update(req,res){
    let products = await product.update(req.params.id,req.body).catch((err)=>{
        return {error : err}
    }) 
    console.log("pro",products)
    if(!products || (products && products.error)){
        let url = (product && product.data && product.data.id) ? '/product/'+product.data.id:'/product';
        return res.redirect(url);
    }

    let url = (products && products.data && products.data.id) ? '/product/'+products.data.id:'/product';
    console.log("url",url)
    return res.redirect(url);
}

async function pDelete(req,res){
    let products = await product.pDelete(req.params.id,1).catch((err)=>{
        return {error : err}
    }) 
    console.log("delete",products)
    if(!products || (products && products.error)){
        let url = (req.params && req.params.id) ? '/product/'+req.params.id:'/product';
        return res.redirect(url);
    }
    return res.redirect('/product');
}

async function pRestore(request,response){
    let products = await product.pRestore(request.params.id,0).catch((err)=>{
        return {error : err}
    })
    if(!products || (products && products.error)){
        let url = (request.params && request.params.id) ? "/product/"+request.params.id:"/product";
        return response.redirect(url)
    }
    return response.redirect("/product")
}
module.exports = {
    viewAll,
    viewDetail,
    addUI,
    add,
    updateUI,
    update,
    pDelete,
    pRestore
}
