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
export const deleteProductInCart = async (
  productId: number, // id của sản phẩm muốn xoá
  user_id: number,   
  sumCart: number    
) => {
  // 1. Lấy cart của user kèm cartDetail
  const cart = await prisma.cart.findUnique({
    where: { user_id }, // lấy theo diều kiện của user trong giỏ hàng
    include: { cartDetail: true }, // lấy cartDetail
  });
// nếu không có giỏ hàng thì trả về lỗi
  if (!cart) throw new Error('Cart not found');

  // 2. Tìm cartDetail theo productId
  // find(): dừng để tìm phần tử đầu tin trong mảng thoả mãn điều kiện
  const cartItem = cart.cartDetail.find(item => item.product_id === productId);
  if (!cartItem) throw new Error('Product not found in cart');

  // 3. Xoá cartDetail
  await prisma.cartDetail.delete({
    where: { id: cartItem.id },
  });

  // 4. Nếu không còn sản phẩm -> xoá giỏ
  if (sumCart <= 1) {
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  } else {
    // 5. Cập nhật lại tổng số sản phẩm
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: {
          decrement: cartItem.quantity, // hoặc 1 nếu chỉ xoá 1
        },
      },
    });
  }
};
// sử dụng promise.all() để update song song tối ưu hơn khi sử dụng for ...await
export const updateCartDetailBefore = async (data: { id: string; quantity: string }[]) => {
  const updatePromises = data.map(item =>
    prisma.cartDetail.update({
      where: { id: +item.id },
      data: { quantity: +item.quantity },
    })
  );

  await Promise.all(updatePromises);
};
// export const updateCartDetailBefore = async(data:{id:string,quantity:string}[])=>{
//   for(let i=0 ;i<data.length;i++ ){
//     await prisma.cartDetail.update({
//       where:{
//         id:+data[i].id
//       },
//       data:{
//         quantity:+data[i].quantity
//       }
//     }

//   )
//   }
// }
export const handlePlaceOrder = async(
  userId:number ,
  receiverName:string,
  receiverAddress:string,
  receiverPhone:string,
  totalPrice:number
)=>{
  //lấy cart theo userId kèm cartDetail
  const cart = await prisma.cart.findUnique({
    where:{user_id:userId},
    include:{
      cartDetail:true
    }
  })
  // nếu có cart thì create order , lấy cartDetail
  if(cart){
    const dataOrderDetail = cart?.cartDetail?.map(item => ({
      price: +item.price || 0,
      quantity: +item.quantity || 1,
      productId: +item.product_id
    })) ?? [];
    await prisma.order.create({
  data:{
    receiverName,
    receiverAddress,
    receiverPhone,
    paymentMethod:"COD",
    statusMethod:"PAYMENT_UPDATE",
    status:"PENDING",
    totalPrice:String(totalPrice),
    userId,
    orderDetail:{
      create:dataOrderDetail
    }
  }
  })
  } 
  // remove cartDetail+cart
  await prisma.cartDetail.deleteMany({
    where:{cart_id:cart?.id}
  })
  await prisma.cart.deleteMany({
    where:{id:cart?.id}
  })
  
}