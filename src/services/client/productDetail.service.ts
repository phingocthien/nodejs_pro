import { prisma } from "../../config/client"

export const getProductById = async(id:number)=>{
   const productId= await prisma.product.findUnique({
    where:{
      id
    }
   })
   return productId  
}