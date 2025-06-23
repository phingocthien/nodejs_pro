
import { prisma } from "../../config/client";
import { ACCOUNT_TYPE, TOTAL_LIMIT } from "../../config/constant";
import bcrypt from "bcrypt"
import path from "path";
import fs from "fs";
const SaltRound =10;
// hàm dùng để mã hoá  mật khẩu  người dùng trước khi lưu vào database
const hashPassword = async(password:string)=>{
    return await bcrypt.hash(password,SaltRound)
}
// hàm so sánh mật khẩu người dùng và mật khẩu mã hoá
const comparePassWord =async(password:string,hashPassword:string)=>{
return await bcrypt.compare(password,hashPassword)
}
const handleCreateUser = async (
    fullName: string,
    username: string,
    address: string,
    phone: string,
    avatar: string,
    role:string
  ) => {
    const passwordDefault = await hashPassword("123456");
    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        password: passwordDefault, // Hash password
        address,
        phone,
        accountType: ACCOUNT_TYPE.SYSTEM,
        avatar,
        roleId:+role
      },
    });
  
    return user;
  };
// getAllUser
const handleGetAllUser = async(currentPage:number)=>{ 
  let limit =TOTAL_LIMIT;
  let skip = (currentPage-1)*limit;
    const getUsers = await prisma.user.findMany({
      skip,
      take :limit
    });
    return getUsers;
}
// tính tổng page 
const totalPageUser = async()=>{
  let limit = TOTAL_LIMIT;
  // lấy tổng page trong user
  const total = await  prisma.user.count()
const totalPages = Math.ceil(total / limit);
return totalPages
}
//getAllrole
const getAllRole = async()=>{
    const roles = await prisma.role.findMany();
    
    return roles
}

// updateUser
const handleUpdateUser = async (
  id: string,
  fullName: string,
  address: string,
  role: string,
  phone: string,
  avatar?: string
) => {
    // B1: Lấy thông tin user hiện tại để lấy ảnh cũ
  const currentUser = await prisma.user.findUnique({
    where: { id: +id },
  });

  // B2: Nếu có ảnh mới và ảnh cũ không phải mặc định => xoá ảnh cũ
  if (
    avatar &&
    currentUser?.avatar &&
    currentUser.avatar !== "default-avatar.png"
  ) {
    const oldImagePath = path.join(__dirname, "../../public/images/user", currentUser.avatar);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath); // xoá ảnh cũ
    }
  }
  // B3: Cập nhật thông tin người dùng
  const updateUser = await prisma.user.update({
    where: { id: +id },
    data: {
      fullName,
      address,
      phone,
      roleId: Number(role),
      ...(avatar !== undefined && { avatar }),
    },
  });

  return updateUser;
};

const handleDeleteUser = async(
    id : string
)=>{
    const deleteUser =await prisma.user.delete({
        where:{id: +id}
    });
    return deleteUser;
    
}
//VIEW
const getUserById =async(id :number)=>{
    const userId =prisma.user.findUnique({
        where:{
                id
            }
        })
        return userId
}

export {handleCreateUser,handleGetAllUser,handleUpdateUser,handleDeleteUser,getAllRole,getUserById,hashPassword,comparePassWord,totalPageUser}