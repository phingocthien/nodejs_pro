import { Request, Response } from "express";
import { getProductInCart } from "../../services/client/productInCart.service";
import { getPaginatedProductHomePage, getTotalProductPageHomePage } from "../../services/client/productHome.service";
import { processOrder } from "../../services/client/processOrder.service";
import { deleteProductInCart } from "../../services/client/deleteProductInCart.service";
import { updateCartDetailBefore } from "../../services/client/updateCartDetail.service";

export const getCartPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    try {
        const cartDetails = await getProductInCart(user.id);
    // total price trong cartDetail
        const totalPrice = cartDetails
            .map(item => item.price * item.quantity)
            .reduce((a, b) => a + b, 0);
        const cartId = cartDetails.length ? cartDetails[0].cart_id : 0
        return res.render("client/product/cart.ejs", {
            cartDetails,
            totalPrice,
            cartId
        });
    } catch (error) {
        console.error("Error loading cart page:", error);
        return res.status(500).render("client/500.ejs", {
            message: "Đã xảy ra lỗi khi tải giỏ hàng."
        });
    }
};

// xoá sản phẩm trong giỏ hàng

export const deleteProductCart = async (req: Request, res: Response) => {
    const { id } = req.params; // id của sản phẩm

    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    try {
        // Ép kiểu sau khi đã đảm bảo user tồn tại trong giỏ hàng
        const { id: userId, sumCart } = user as { id: number; sumCart: number };
        await deleteProductInCart(Number(id), userId, sumCart);

        return res.redirect("/cart");
    } catch (error) {
        console.error("Error deleting product from cart:", error);
        return res.status(500).render("client/500.ejs", {
            message: "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng."
        });
    }
};

// update quantity , sum(cart) trước khi checkout 
export const postQuantityBeforeUpdate= async (req:Request , res :Response)=>{
    const user =req.user 
    const {cartId} = req.body
    if(!user) return res.redirect("/login")
        // get cartDetail từ body 
   const currentCartDetail :{id:string,quantity:string}[] = req.body?.cartDetails??[]
   await updateCartDetailBefore(currentCartDetail,cartId)
    return res.redirect("/checkout")

}
export const getCheckOutPage = async(req:Request ,res:Response)=>{
    const user = req.user
    if(!user) res.redirect("/login")
    const cartDetails =await getProductInCart(user!.id )
    const totalPrice = cartDetails.map(item=>item.price*item.quantity)
    .reduce((a,b)=>a+b,0)
    return res.render ("client/product/checkout",{
        cartDetails,totalPrice
    })   
}
export const postPlaceOrder = async(req:Request,res:Response)=>{
const user = req.user
if(!user) return res.redirect("/login")
 const{totalPrice,receiverName,receiverAddress,receiverPhone }=req.body ||{}
 // Kiểm tra dữ liệu đầu vào cơ bản (Tùy chọn nhưng nên có)
 if (!totalPrice || !receiverName || !receiverAddress || !receiverPhone) {
    console.log('error', 'Vui lòng cung cấp đầy đủ thông tin đặt hàng.');
    return res.redirect("/checkout"); // Hoặc trang đặt hàng
}
// gọi hàm processOrder 
  const data = await processOrder(user.id,receiverName,receiverAddress,receiverPhone,totalPrice)
  if(data.success){
   return res.redirect("/thank")
  }
   return res.redirect("/checkout")
}
// 

export const getPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

        let currentPages = parseInt(req.query.page as string) || 1;
        if (currentPages < 1) currentPages = 1;
        const products = await getPaginatedProductHomePage(currentPages,8);
        const totalPages = await getTotalProductPageHomePage(8)
        return res.render("client/product/thank", {
            products,
            page:currentPages,
            totalPages
        });
};
