
import { prisma } from "../../config/client";
// Giả định các tham số này được truyền vào hàm của bạn
// (userId, receiverName, receiverAddress, receiverPhone, totalPrice)
// và totalPrice đã được tính toán chính xác trước đó.

 export const processOrder = async (
    userId: number, 
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    totalPrice: number 
) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Lấy giỏ hàng và chi tiết giỏ hàng của người dùng
            const cart = await tx.cart.findUnique({
                where: { user_id: userId },
                include: {
                    cartDetail: true // Bao gồm chi tiết giỏ hàng
                }
            });

            // Kiểm tra giỏ hàng có tồn tại và có sản phẩm không
            if (!cart || !cart.cartDetail || cart.cartDetail.length === 0) {
                throw new Error("Giỏ hàng trống hoặc không hợp lệ.");
            }

            // 2. Thu thập tất cả các product_id từ giỏ hàng
            const productIdsInCart = cart.cartDetail.map(item => item.product_id);

            // 3. Lấy tất cả thông tin sản phẩm cần thiết từ database trong MỘT truy vấn
            // Đảm bảo chọn 'quantity' và 'sold' để cập nhật sau này
            const productsInDb = await tx.product.findMany({
                where: {
                    id: {
                        in: productIdsInCart
                    }
                },
                select: {
                    id: true,
                    name: true, // Để hiển thị tên sản phẩm trong lỗi
                    quantity: true, // Số lượng tồn kho
                    sold: true // Số lượng đã bán
                }
            });

            // Chuyển đổi mảng sản phẩm thành một Map để tra cứu nhanh chóng
            const productMap = new Map(productsInDb.map(p => [p.id, p]));

            // Mảng để lưu trữ các Promise cập nhật sản phẩm
            const productUpdatePromises: Promise<any>[] = [];

            // 4. Kiểm tra tồn kho và chuẩn bị cập nhật số lượng
            for (const cartItem of cart.cartDetail) { 
                const product = productMap.get(cartItem.product_id);

                // Kiểm tra sản phẩm có tồn tại không
                if (!product) {
                    throw new Error(`Sản phẩm với ID '${cartItem.product_id}' không được tìm thấy.`);
                }

                // Kiểm tra số lượng tồn kho
                if (product.quantity < cartItem.quantity) {
                    throw new Error(`Không đủ số lượng cho sản phẩm '${product.name}'. Tồn kho: ${product.quantity}, Yêu cầu: ${cartItem.quantity}.`);
                }

                // Chuẩn bị Promise cập nhật sản phẩm (chưa await ngay)
                productUpdatePromises.push(
                    tx.product.update({
                        where: { id: product.id },
                        data: {
                            quantity: {
                                decrement: cartItem.quantity // Giảm số lượng tồn kho
                            },
                            sold: {
                                increment: cartItem.quantity // Tăng số lượng đã bán
                            }
                        }
                    })
                );
            }

            // 5. Thực hiện tất cả các cập nhật sản phẩm cùng lúc
            await Promise.all(productUpdatePromises);
            console.log("Đã cập nhật số lượng tồn kho và số lượng đã bán của sản phẩm.");

            // 6. Tạo Order và OrderDetail (Chỉ khi tất cả kiểm tra và cập nhật tồn kho thành công)
            const dataOrderDetail = cart.cartDetail.map(item => ({
                price: +item.price || 0,
                quantity: +item.quantity || 1,
                productId: +item.product_id
            }));

            const createdOrder = await tx.order.create({
                data: {
                    receiverName,
                    receiverAddress,
                    receiverPhone,
                    paymentMethod: "COD",
                    statusMethod: "PAYMENT_UPDATE",
                    status: "PENDING",
                    totalPrice: String(totalPrice), // Đảm bảo totalPrice trong schema là String
                    userId,
                    orderDetail: {
                        create: dataOrderDetail
                    }
                }
            });
            console.log(`Đã tạo đơn hàng mới với ID: ${createdOrder.id}`);

            // 7. Xóa Cart và CartDetail (Chỉ khi Order đã được tạo thành công)
            await tx.cartDetail.deleteMany({
                where: { cart_id: cart.id }
            });
            console.log(`Đã xóa chi tiết giỏ hàng cho giỏ hàng ID: ${cart.id}`);

            await tx.cart.delete({ // Dùng delete thay vì deleteMany nếu chỉ xóa 1 cart theo ID duy nhất
                where: { id: cart.id }
            });
            console.log(`Đã xóa giỏ hàng ID: ${cart.id}`);

            // Trả về kết quả thành công của giao dịch
            return { success: true, message: "Đặt hàng thành công!", order: createdOrder };
        });

        return result; // Trả về kết quả của transaction

    } catch (error: any) {
        console.error("Lỗi trong quá trình xử lý đơn hàng:", error.message);
        // Ném lỗi lại để xử lý ở tầng controller hoặc route
        throw new Error(`Đặt hàng thất bại: ${error.message}`);
    } finally {
        // Không cần disconnect ở đây nếu prisma client được quản lý toàn cục
        // await prisma.$disconnect();
    }
};