
import { prisma } from "../../config/client"
import { TOTAL_LIMIT } from "../../config/constant";
export const getPaginatedProductHomePage = async (currentPage: number,pageSize:number) => { 
  const skip = (currentPage-1)*pageSize
  try {
    const products = await prisma.product.findMany({
      skip,
      take: pageSize
    });
    return products;
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    return [];
  }
};
// lấy tổng sản phẩm trong page
export const getTotalProductPageHomePage = async (pageSize:number) => {
  try {
    const total = await prisma.product.count();
    return Math.ceil(total / pageSize);
  } catch (error) {
    console.error('Error counting total pages:', error);
    return 1;
  }
};

const handleProductCart =async( quantity:number,productId:number , user:Express.User)=>{
  // kiểm tra sự tồn tại của cart
  // nếu tồn tại  thì update ngược lại thì create
  //findUnique : lấy bản ghi duy nhất dựa vào khoá chính hoặc 1 trường có @unique
  // findFirst tìm bản khi đầu tiên khớp với nhiều điều kiện bất kì không bắt buộc khoá chính hay @unique
  const exitingCart = await prisma.cart.findFirst({
    where:{ user_id:user.id  } 
  })
  // tìm sản phẩm
  const product = await prisma.product.findUnique({
    where:{id:productId}
  })
  // nếu sản phẩm đã tồn tại
  if(exitingCart){
    // cập nhập sum trong cart
    await prisma.cart.update({
      where:{id:exitingCart.id},
      data:{
        sum: {
          // tăng giá trị number theo quantity
          increment: quantity
        }
      }
    })
    //kiểm tra  sản phẩm  đã tồn tại trong chi tiết  giỏ hàng chưa
    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        product_id: productId,
        cart_id: exitingCart.id,
      },
    });
    // nếu có rồi -> cập nhập số lượng và giá
    if (currentCartDetail) {
      await prisma.cartDetail.update({
        where: { id: currentCartDetail.id },
        data: {
          quantity: { increment: quantity },
          price: { increment: product?.price },
        },
      });
      //  nếu chưa có -> tạo mới cartDetail
    } else {
      await prisma.cartDetail.create({
        data: {
          product_id: productId,
          cart_id: exitingCart.id,
          quantity,
          price: product?.price!,
        },
      });
    }
  // nếu chưa có giỏ hàng tạo giỏ hàng mới kèm cartDetail 
  }else{
    //create cart + cartDetail
    // ! giúp prisma hiểu trưởng không phải là undefined
    await prisma.cart.create({
      data:{
        sum: quantity,
        user_id:user.id,
        //nested - write-prisma
        cartDetail:{
          create:[
            {
              quantity:quantity,
              price:product?.price!,
              product_id:product?.id!,
            }
          ]
        }
      }
    })
  }
}
const getUserSumCart = async(id:string)=>{
   const userCart= await prisma.cart.findUnique({
    where:{user_id:+id} // cho biét id của user nào
   })
   return userCart?.sum??0
}

export {
 handleProductCart,getUserSumCart 
}