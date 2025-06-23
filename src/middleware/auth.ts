import { NextFunction, Request, Response } from "express";

export const isLoggedIn = async(req:Request,res:Response,next:NextFunction)=>{
  if(req.isAuthenticated()){
    res.redirect("/")
    return;
  }
   else next();
}
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

  if (req.path.startsWith('/admin')) {
    const user =req.user 
    if(user?.role?.name==="ADMIN"){
      next(); // Cho phép đi tiếp đến controller
    } else res.render("status/403"); // Không phải admin, chuyển về trang chủ
    return; 
  }
  //client routes
  next();
 
};

  



