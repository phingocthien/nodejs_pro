import { Request, Response } from "express";
import { deleteProductInCart, getProductInCart, handlePlaceOrder, updateCartDetailBefore } from "../../services/client/productCart.service";

export const getCartPage = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.redirect("/login");
    }

    try {
        const cartDetails = await getProductInCart(user.id);

        const totalPrice = cartDetails
            .map(item => item.price * item.quantity)
            .reduce((a, b) => a + b, 0);

        return res.render("client/product/cart.ejs", {
            cartDetails,
            totalPrice
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

// update quantity trước khi checkout 
export const postQuantityBeforeUpdate= async (req:Request , res :Response)=>{
    const user =req.user 
    if(!user) return res.redirect("/login")
   console.log(req.body)
   const currentCartDetail :{id:string,quantity:string}[] = req.body?.cartDetails??[]
   await updateCartDetailBefore(currentCartDetail)
   console.log(req.body)
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
const user = req .user
if(!user) return res.redirect("/login")
 const{totalPrice,receiverName,receiverAddress,receiverPhone }=req.body ||{}
  await handlePlaceOrder(user.id,receiverName,receiverAddress,receiverPhone,totalPrice)
    return res.redirect("/thank")
}
// 

export const getPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.redirect("/login");
    }
    try {
        return res.render("client/product/thank", {
            user
        });
    } catch (error) {
        console.error("Error loading thank you page:", error);
        return res.status(500).render("client/500", {
            message: "Đã xảy ra lỗi khi tải sản phẩm."
        });
    }
};
