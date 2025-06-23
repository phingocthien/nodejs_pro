
import { z } from "zod";
import { isEmailExist, } from "../services/client/auth.service";
// password zod
const passWordSchema = z
    .string()
    .min(3,{message:"Mật khẩu tối thiểu 3 kí tự"})
    .max(20,{message:"Mật khẩu tối đa 20 kí tự"})
    .refine((password)=>/[A-Z]/.test(password),{
        message:"Mật khẩu bao gồm 1 kí tự viết hoa"
    })
    .refine((password)=>/[0-9]/.test(password),{
        message:"Mật khẩu bao gồm ít nhất 1 chứ số"
    })
    .refine((password)=>/[!@#$%^&*]/.test(password),{
        message:"Mật khẩu bao gồm ít nhất 1 kí tự đặc biệt"
    })
// Email zod
// Nhận phản hồi và trả về exception
const emailSchema = z
  .string()
  .email("Email không đúng định dạng")
  .refine(
    async (email) => {
      const existingUser = await isEmailExist(email);
      return !existingUser; // Trả về true nếu email chưa tồn tại
    },
    {
      message: "Email đã được sử dụng",
      path: ["email"], // Không bắt buộc nếu validate field đơn lẻ
    }
  );


export const registerSchema = z.object({
    fullname:z.string().trim().min(1,{message:"Tên không được để trống "}),
    email:emailSchema,
    password :passWordSchema,
    confirmPassword :z.string(),
})
   .refine((data)=>data.password===data.confirmPassword,{
    message:"Password confirm không chính xác",
    path:['confirmPassword']
   })
export type TRegisterSchema = z.infer<typeof registerSchema>