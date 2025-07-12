
import { prisma } from "../../config/client"
import { ACCOUNT_TYPE } from "../../config/constant"
import { hashPassword } from "../admin/user.service"


// Kiểm tra Email có tồn tại trong DataBase hay không
export const isEmailExist = async (email: string)  => {
    const user = await prisma.user.findUnique({
      where: { username:email },
    });
    
    return !!user; // Trả về true nếu có user, false nếu không
  };
  
 // create user register
  export const registerNewUser = async (
   fullname: string,
   email: string,
   password: string,
   avatar:string
 ) => {
   // Băm mật khẩu
   const newPassword = await hashPassword(password);
 
   // Tìm role có name = "USER"
   const userRole = await prisma.role.findUnique({
     where: { name: "USER" },
   });
 // nếu khác userRole thì throw error
   if (!userRole) {
     throw new Error("Role USER không tồn tại trong hệ thống.");
   }
 
   // Tạo user mới
   const user = await prisma.user.create({
     data: {
       username: email,
       password: newPassword,
       fullName: fullname,
       accountType: ACCOUNT_TYPE.SYSTEM,
       roleId: userRole.id,
       avatar,
     },
   });
 
   return user;
 };
export const joinUsedRole =async(id :number)=>{
  const user =prisma.user.findUnique({
      where:{
              id
          },
      include:{
          role:true
        }
      })
      return user
}
