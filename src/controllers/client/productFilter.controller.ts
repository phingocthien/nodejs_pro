import {  getProductWithFilter } from "../../services/client/productFilter.service";
import {  handleProductCart } from "../../services/client/productHome.service";
import { Response, Request } from "express"
export const getProductFilterPage = async (req: Request, res: Response) => {
    try {
      const {factory="",target="",price="",sort=""}=req.query as {factory :string,target :string,price :string,sort :string}
      let currentPages = parseInt(req.query.page as string) || 1;
      if (currentPages < 1) currentPages = 1;
     const data= await getProductWithFilter(currentPages,6,factory,target,price,sort)
      res.render('client/product/filter', { 
        totalPages : data.totalPages,
        products: data.products,
        page: +currentPages
      });
    } catch (error) {
      res.status(500).render('status/500', {
        message: "Không thể tải trang chủ",
        error
      });
    }
  };
 export const postAddProductFilter=async(req:Request,res:Response)=>{ 
    const{id}=req.params; // lấy id từ view gửi lên
    const user = req.user; // lấy người dùng
    // kiểm tra đăng nhập người dùng
    if(user){
      await handleProductCart(1,+id,user)
    }else{
      return res.redirect("/login")
    }
     return res.redirect("/product") // <=> url id
    }
    