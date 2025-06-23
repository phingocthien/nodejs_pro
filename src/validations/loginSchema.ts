import { z } from "zod";
export const loginSchema = z.object({
    username:z.string()
    .min(1,{message:'Tên không được để trống'})
    .max(50,{message:'Tên đăng nhập không được quá 50 kí tự'}),
    password:z.string()
    .min(1,{message:'Mật khẩu không được để trống'})
    .max(6,{message:'Mật khẩu có ít nhất 6 kí tự'})
    .max(100,{message:'Mật khẩu không được quá 100 kí tự'})
})
export type loginInput = z.infer<typeof loginSchema>