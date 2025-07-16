import { prisma } from "../../config/client";

export const getCount = async()=>{
    const countUser =await prisma.user.count()
    const countProduct =await prisma.product.count()
    const countOrder =await prisma.order.count()
 
    return {countUser,countProduct,countOrder}
    
 }