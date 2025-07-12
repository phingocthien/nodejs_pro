import { prisma } from "../../config/client";

export const updateCartDetailBefore = async(data:{id:string,quantity:string}[] ,cartId:string)=>{
    let quantity = 0
    for(let i=0 ;i<data.length;i++ ){
      quantity=quantity+ (+data[i].quantity)
      await prisma.cartDetail.update({
        where:{
          id:+data[i].id
        },
        data:{
          quantity:+data[i].quantity
        }
      }
  
    )
    }
    // update sumCart theo cartId
    return await prisma.cart.update({
      where:{id:Number(cartId)},
      data:{sum:quantity}
    })
  };
  