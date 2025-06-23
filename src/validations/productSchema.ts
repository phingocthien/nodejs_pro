import { number, z } from "zod";
// create schema  for object
// Refine: custom logic validate
// Transform: biến đổi dữ liệu, ví dụ từ string => number
export const productSchema = z.object({
   id:z.string().optional(), //truyền dữ liệu lên thì validate còn nếu ko truyền nên thì ko validate
 name : z.string().trim().min(1,{message:"Tên không được để trống"}),
 price :z.string()
 .transform((val)=>(val ==="" ? 0 :Number(val)))
 .refine((num)=>num>0,{
    message:"số tiền tối thiểu là 1"
 }),

 detailDesc : z.string()
  .trim()
  .min(1,{message:"detailDesc không được để trống"}),

 ShortDesc : z.string()
  .trim()
  .min(1,{message:"ShortDesc không được để trống"}),

 quality :z.string()
 .transform((val)=>(val ==="" ? 0 :Number(val)))
 .refine((num)=>num>0,{
    message:"số lượng tối thiểu là 1 "
 }),
 factory : z.string()
 .trim()
 .min(1,{message:"Factory không được để trống"}),
 
 target : z.string()
 .trim()
 .min(1,{message:"target không được để trống"}),

});
export type TProduct = z.infer<typeof productSchema>;