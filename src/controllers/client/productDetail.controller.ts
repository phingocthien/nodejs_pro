import { Request, Response } from "express";
import { getProductById } from "../../services/client/productDetail.service";
import { handleProductCart } from "../../services/client/productHome.service";

export const getProductDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    // ko tìm thấy sản phẩm trả và message lỗi
    if (!product) {
        return res.status(404).render("client/404.ejs", { message: "Product not found" });
    }

    return res.render("client/product/detail.ejs", {
        product
    });
};
// thêm san phẩm vào giỏ hàng và hiển thi số lượng

export const postAddDetailCart = async (req: Request, res: Response) => {
    const { id } = req.params; // productId
    const { quantity } = req.body;
    const user = req.user;

    if (!user) {
        return res.redirect("/login");
    }

    try {
        await handleProductCart(Number(quantity), Number(id), user);
        return res.redirect(`/product/${id}`);
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).render("client/500.ejs", {
            message: "Có lỗi xảy ra khi thêm vào giỏ hàng.",
        });
    }
};
