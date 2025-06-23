import   { Request, Response } from "express"
import express from 'express';
import { getAllRole, handleGetAllUser, getUserById, handleCreateUser, handleDeleteUser, handleUpdateUser, totalPageUser } from "../../services/admin/user.service"
// getUserHonePage
const getUserHomePage=async(req:Request,res:Response)=>{ 
    let currentPage =  parseInt (req.query.page as string) || 1
    if(currentPage<1) currentPage =1 ;
    const users =  await handleGetAllUser(currentPage);
    const totalPageUsers = await totalPageUser();
    return  res.render("admin/user/show",{
        users,
        totalPageUsers,
        currentPage,
    })
}
// Create User
const postCreateUserPage=async(req:Request,res:Response)=>{
    // client gui req len server lấy thông qua field name trong form
    const {fullName, username,address,phone,role} = req.body || {};// tránh crash nếu body null
 
    const avatar=req.file?.filename?? "";
    // update in database
    await handleCreateUser(fullName,username,address,phone,avatar,role);

    return res.redirect("/admin/user");
}

//getCreateUserPage
const getCreateUserPage=async(req:Request,res:Response)=>{
    const roles = await getAllRole();
    return  res.render("admin/user/create-user",{
        roles
    })
}

const postUpdateUserPage=async(req:Request,res:Response)=>{
    // lấy trường name trong rep.body (form)
    const {id,fullName,address,role,phone} =req.body ;
    const avatar=req.file?.filename?? undefined
    // lưu ý truyền đúng vị trí ứng với input đầu vào
    await handleUpdateUser(id,fullName,address,role,phone,avatar);
    
  
    return res.redirect("/admin/user")
}

const postDeleteUserPage=async(req:Request,res:Response)=>{
    // 
    const {id}=req.params;
    await handleDeleteUser(id)
 return res.redirect("/admin/user")
}
const postViewUserPage=async(req:Request,res:Response)=>{
    // lấy tham số URL path
    const {id}=req.params;
    const roles=await getAllRole()
    const user=await getUserById(+id);
 return res.render("admin/user/view-user",{
    id,
    roles,
    user,
 });
}
export{getCreateUserPage,postCreateUserPage,postUpdateUserPage,postDeleteUserPage,getUserHomePage,postViewUserPage}