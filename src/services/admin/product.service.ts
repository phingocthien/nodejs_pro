import { Request, Response } from "express";
import { prisma } from "../../config/client";
import { number } from "zod";
import { TOTAL_LIMIT } from "../../config/constant";

const  handleCreateProduct = async(
    name: string,
    price:number,
    ShortDesc:string,
    detailDesc:string,
    quantity:number,
    factory:string,
    target:string,
    image? : string
)=>{
    await prisma.product.create({
        data:{
            name,
            price,
            ShortDesc,
            detailDesc,
            quantity,
            factory,
            target,
            ...(image !== undefined && {image})
        }
    })
}
 const getAllProduct = async(currentPage: number)=>{
    let limit = TOTAL_LIMIT;
    let skip = (currentPage -1)*limit;
    const product =await prisma.product.findMany({
        skip,
        take : limit
    });
    return product;
 }
 const totalPageProduct = async ()=>{
    let limit = TOTAL_LIMIT;
    const total = await prisma.product.count();
   const totalPage = Math.ceil(total/limit);
   return totalPage;
 }
 const handleDeleteProduct = async(
    id:string
 )=>{
    const deleteProduct = await prisma.product.delete({
        where :{
            id:+id
        }});
        return deleteProduct;
 }
 
 const handleViewProduct = async(
    id :string
 )=>{
    const viewProduct = await prisma.product.findUnique({
        where :{
            id:Number(id)
        }});
        return viewProduct;
 }
  // updateUser
  const handleUpdateProduct = async(
      id:string,
      name:string,
      price:number,
      detailDesc:string,
      ShortDesc:string,
      quantity :number,
      factory:string,
      target:string,
      image?:string,// nên để avatar là optional
  
  )=>{
  
      const updateProduct = await prisma.product.update({
          where:{ id:Number(id)}, // ép kiểu sang number
          data:{
              name,
              price,
              detailDesc,
              ShortDesc,
              quantity,
              factory,
              target,
              ...(image!== "" && { image }) // chỉ cập nhật avata nếu có
      }});
      
      return updateProduct 
  }  
export {
    handleCreateProduct,getAllProduct,handleDeleteProduct,handleViewProduct,handleUpdateProduct,totalPageProduct}