import { Request, Response } from "express";
import { handleOrderHistory, handleOrderViewPage } from "../../services/admin/order.service";

export const postViewOrderPage=async(req:Request,res:Response)=>{
    // lấy tham số URL path
    const {id}=req.params;
    const orderViews = await handleOrderViewPage(+id)
    return res.render("admin/order/orderDetail",{orderViews})
 }
