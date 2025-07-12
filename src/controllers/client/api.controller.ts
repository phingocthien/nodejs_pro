import { Request, Response } from "express";
import { prisma } from "../../config/client";
import { deleteUser, handelUpdateUser, handleGetAllUser, handleGetUserById, handleLoginApi } from "../../services/client/api.service";
import { registerSchema, TRegisterSchema } from "../../validations/registerSchema";
import { registerNewUser } from "../../services/client/auth.service";
import { handleProductCart } from "../../services/client/productHome.service";
import { loginInput, loginSchema } from "../../validations/loginSchema";
export const getAllUserApi = async(req:Request,res:Response)=>{
  const users = await handleGetAllUser();
  const user = req.user;
  console.log(user)
    res.status(200).json({
     data:users
  })
}
 // get a user id
 export const  getUserIdApi = async(req:Request,res:Response)=>{
    const {id}=req.params
    const userId = await handleGetUserById(+id)
    res.status(200).json({
        data:userId
    })
 } 
 export const postCreateUserApi = async(req:Request,res:Response)=>{
    const {fullname,email,password}=req.body as TRegisterSchema
    const avatar = req.file?.filename ?? ""
    const validate = await registerSchema.safeParseAsync(req.body)
    if (!validate.success) {
        // error
        const errorZod = validate.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);

       res.status(400).json({
        errors,
       })
       return;
      }
  //success
    await registerNewUser(fullname,email,password,avatar)
    res.status(201).json({
     data:"create user success"
    })
 } 
 export const putUserApi = async(req:Request,res:Response)=>{
   const {address , fullName , phone, role  } = req.body
   const {id} = req.params
   const avatar = req?.file?.filename?? ""
   try {
      const userUpdate = await handelUpdateUser(+id,address,fullName,phone,role,avatar)
      res.status(200).json({
         data:userUpdate,
         message:"update user success"
      })
   } catch (error:any) {
      res.status(500).json({
         data:null,
         message:error.message
      })
   }
   
 }
 export const deleteUserApi=async(req:Request,res:Response)=>{
   const {id}=req.params;
   try {
      const users = await deleteUser(+id)
      res.status(200).json({
         data:users,
         message:"delete user success"
      })
   } catch (error:any) {
      res.status(500).json({
         message:error.message
      })
   }
 }

export const postLogInApi = async(req:Request,res:Response)=>{
   // lấy username , password từ req.body
   const {username,password}=req.body as loginInput;
  // validate data với zod
   const validate = await loginSchema.safeParseAsync(req.body)
   if (!validate.success) {
      // error
      const errorZod = validate.error.issues;
      const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);

     res.status(400).json({
      errors,
     })
     return;
   }
   try {
      const access_token = await handleLoginApi(username,password)
      res.status(200).json({
         data:access_token
      })
   } catch (error:any) {
      res.status(401).json({
         data:null,
         message:error.message
      })
   }
}
