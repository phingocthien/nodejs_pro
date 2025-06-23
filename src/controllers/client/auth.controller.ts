import { NextFunction, Request, Response } from "express"
import { registerSchema, TRegisterSchema } from "../../validations/registerSchema"
import { registerNewUser } from "../../services/client/auth.service";


const getLoginPage = async (req: Request, res: Response) => {
  const {session} = req as any;

  // Đọc và xoá messages sau khi đọc
  const messages = session.messages || [];
  return res.render("client/auth/login", {
    messages,
  });
};

const getRegisterPage = async(req:Request,res:Response)=>{
    // Khởi tạo mảng lỗi và dữ liệu cũ để hiển thị trên form nếu cần
  const errors: string[] = [];
  // dữ liệu cũ
  const oldData = {
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    
  };
    return res.render("client/auth/register",{
        errors,
        oldData

    })
}

const postRegisterPage = async(req:Request,res:Response)=>{
    const {fullname,email,password,confirmPassword}=req.body as TRegisterSchema
    const validate = await registerSchema.safeParseAsync(req.body)
    // kiểm tra validate và trả về olddata
    if (!validate.success) {``
        // Trích xuất mảng lỗi
        const errorZod = validate.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);
    
        // Giữ lại dữ liệu người dùng đã nhập để fill form lại
        const oldData = { fullname ,email , password, confirmPassword  };
    
        return res.render("client/auth/register",{
            errors,
            oldData,
        })
      }
    // Nếu hợp lệ, tiếp tục xử lý (ví dụ tạo tài khoản, chuyển trang, ...)
    await registerNewUser(fullname,email,password)
  // Ví dụ: return res.redirect("/login");
  return res.redirect("/login");
}

const redirectAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (user?.role?.name === "ADMIN") {
    return res.redirect("/admin");
  }
  return next(); // Cho phép người dùng khác đi tiếp
};

const postLogOut = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};
export {
    getLoginPage,
    getRegisterPage,
    postRegisterPage,
    redirectAdmin,
    postLogOut
}