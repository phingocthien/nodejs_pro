import { Request, Response } from "express"
import { handleOrderHistory } from "../../services/admin/order.service"

export const getOrderHistory=async(req:Request,res:Response)=>{
    // lấy tham số URL path
   const user = req.user
   if(!user) return res.redirect("/login")
    const rawOrders = await handleOrderHistory(user.id)
     // Tính tổng thành tiền cho từng đơn hàng
  const orderHistorys = rawOrders.map((order) => {
    const totalMoney = order.orderDetail.reduce(
      (sum, item) => sum + item.price *item.quantity,
      0
    );
    return {
      ...order,
      totalMoney,
    };
  });
    return res.render("client/product/order-history",{orderHistorys})
 }