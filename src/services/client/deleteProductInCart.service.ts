import { prisma } from "../../config/client";

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