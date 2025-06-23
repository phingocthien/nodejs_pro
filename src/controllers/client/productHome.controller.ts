import { Response, Request } from "express"
import { getPaginatedProductHomePage, getTotalProductPageHomePage, handleProductCart } from "../../services/client/productHome.service"
const getHomePage = async (req: Request, res: Response) => {
  try {
    let currentPages = parseInt(req.query.page as string) || 1;
    if (currentPages < 1) currentPages = 1;

    const products = await getPaginatedProductHomePage(currentPages,8);
    const totalPages = await getTotalProductPageHomePage(8);

    res.render('client/homePage/show', { 
      products,
      totalPages,
      page: currentPages
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).render('client/error', {
      message: "Không thể tải trang chủ",
      error
    });
  }
};
const postAddProductToCart=async(req:Request,res:Response)=>{ 
const{id}=req.params; // lấy id từ view gửi lên
const user = req.user; // lấy người dùng
// kiểm tra đăng nhập người dùng
if(user){
  await handleProductCart(1,+id,user)
}else{
  return res.redirect("/login")
}
 return res.redirect("/") // <=> url id
}

export {getHomePage,postAddProductToCart}