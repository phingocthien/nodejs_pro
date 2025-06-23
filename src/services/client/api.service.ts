
import { prisma } from "../../config/client"
import { comparePassWord } from "../admin/user.service"
import "dotenv/config"
import jwt from "jsonwebtoken"
export const handleGetAllUser= async()=>{
    return await prisma.user.findMany({})
    
}
export const handleGetUserById = async(id:number)=>{
    return await prisma.user.findUnique({
        where:{id}
    })
}
export const handelUpdateUser = async(id:number,address:string , fullName:string,phone:string,role:string,avatar?:string )=>{
    return await prisma.user.update({
        where:{id},
        data:{
            address,fullName,phone,
            roleId: Number(role),
            ...(avatar !== null && { avatar }),
        }
    })
}
export const deleteUser = async(id:number)=>{
    return await prisma.user.delete({
        where:{id}
    })
}
export const handleLoginApi = async(username:string,password:string)=>{
      const user= await prisma.user.findUnique({
        where:{username:username}
    })
    if(!user){
        throw new Error(`username ${username} not found`)
    }
    else{
        // bam password
        const isPassWord = comparePassWord(password,user.password)
        if(!isPassWord){
        throw new Error(`Invalid password`)
        }
    }
    // Tạo access_token
    // giải mã data
    // Không lưu password và thông tin nhay cảm vào token
    const payload = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        address: user.address,
        phone: user.phone,
        accountType: user.accountType,
        avatar: user.avatar,
        roleId: user.roleId,
    };
    const expiresIn:any = process.env.JWT_EXPIRES_IN 
    const secret:any = process.env.SECRET_PRIVATE;
    const access_token = jwt.sign(
        {payload},
        secret,
        {expiresIn:expiresIn}
    )
        return access_token;
    } 