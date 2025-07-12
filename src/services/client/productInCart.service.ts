
import { prisma } from "../../config/client"

export const getProductInCart = async(user_id:number)=>{
    const cart = await prisma.cart.findUnique({
      where :{user_id}
    })
    if(cart){
      const currentCartDetail = await prisma.cartDetail.findMany({
        where:{cart_id:cart.id},
      include:{product:true} // lấy thông tin trong product
    })
    return currentCartDetail
  }else
    return []
}
// hàm xoá sản phẩm trong cart
// input ( productId , userId , Tổng số lượng sản phẩm muốn xoá trong giỏ hàng)
