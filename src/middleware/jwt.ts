import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
export const checkValidJwt = (req:Request,res:Response ,next:NextFunction)=>{
    // lấy token bearer jwt 
  const jwtToken = req.headers ;
  const token = jwtToken['authorization']?.split(' ')[1]
if(!token){
     res.status(401).json({
        message:"Không có token được dung cấp"
    })
    return ;
}
  // xác thực token
try {
    const decoded:any = jwt.verify(token  ,process.env.SECRET_PRIVATE as string)
    console.log("check decoded " ,decoded)
    // lưu vào biến req.user
  req.user ={
    id:decoded.id,
    username:decoded.username,
    password:"",
    fullName:decoded.fullName,
    address:decoded.address,
    phone:decoded.phone,
    accountType:decoded.accountType,
    avatar:decoded?.avatar,
    roleId:decoded.roleId
   }
   console.log("check user",req.user)
    next()
} catch (error:any) {
    res.status(401).json({
        data:null,
        message:"token không hợp lệ hoặc token đã bị hết hạn"
     })
}

  
}