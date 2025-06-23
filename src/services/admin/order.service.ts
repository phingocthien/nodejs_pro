import { prisma } from "../../config/client";
import { TOTAL_LIMIT } from "../../config/constant";

export const getAllOrderPage = async(currentPage:number)=>{
    let limit = TOTAL_LIMIT;
    let skip = (currentPage-1)*limit
    const order =await prisma.order.findMany({
        skip,
        take:limit,
        include :{user:true}
    });
    return order;
 }
 // totaPage = total/limit lấy nguyên
 export const totalOrderPage = async()=>{
  const limit=TOTAL_LIMIT;
  const orderCount = await prisma.order.count()
  const orderPage = Math.ceil(orderCount/limit);
  return orderPage;
 }
 export const handleOrderViewPage = async(orderId:number)=>{
    const orderDetail =await prisma.orderDetail.findMany({
        where:{orderId},
        include:{product:true}
    });
    return orderDetail;
 }
 export const handleOrderHistory = async(userId:number)=>{
    const orderHistory =await prisma.order.findMany({
        where:{userId},
        // lấy toàn bộ ((product)orderDetail)order
       include: {
        orderDetail:{
            include:{
                product:true
            }
        }
       }
       
        
    });
    return orderHistory;
 }