import  { Request, Response } from "express"
import { getAllProduct, totalPageProduct } from "../../services/admin/product.service"
import { getAllOrderPage, totalOrderPage } from "../../services/admin/order.service"
import { getCount } from "../../services/admin/dashboard.service"

const getAdmin=async(req:Request,res:Response)=>{
    const counts = await getCount()
    return  res.render("admin/dashboard/show",  {counts})
}
const getDashBoardHomePage=async(req:Request,res:Response)=>{
    const counts = await getCount()
    return  res.render("admin/dashboard/show",{counts}
    )
}

const getProductHomePages=async(req:Request,res:Response)=>{
    let currentPage = parseInt(req.query.page as string) || 1
    if(currentPage<1) currentPage =1 ;
    const products = await getAllProduct(currentPage)
    const totalPageProducts = await totalPageProduct()
    return  res.render("admin/product/show",{
        products,
        totalPageProducts,
        currentPage
    })
}
const getOrderHomePage=async(req:Request,res:Response)=>{
    let currentPage = parseInt(req.query.page as string) || 1
    if(currentPage<1) currentPage = 1
    const orders = await getAllOrderPage(currentPage)
    const totalOrderPages = await totalOrderPage()
    return  res.render("admin/order/show",{
        orders,
        currentPage,
        totalOrderPages
    })
}
export{getAdmin,getDashBoardHomePage,getProductHomePages,getOrderHomePage}