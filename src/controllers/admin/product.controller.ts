import { Request, Response } from "express";
import { productSchema, TProduct } from "../../validations/productSchema";
import { handleCreateProduct, handleDeleteProduct, handleUpdateProduct, handleViewProduct } from "../../services/admin/product.service";
const getCreateProductPage = async (req: Request, res: Response) => {
  // Khởi tạo mảng lỗi và dữ liệu cũ để hiển thị trên form nếu cần
  const errors: string[] = [];
 // dữ liệu cũ
  const oldData = {
    name: "",
    price: "",
    ShortDesc: "",
    detailDesc: "",
    quality: "",
    factory: "",
    target: "",
  };

  return res.render("admin/product/create-product", {
    errors,
    oldData,
  });
};

//CREATE PRODUCT
const postCreateProductPage = async (req: Request, res: Response) => {
  const { name, price, ShortDesc, detailDesc, quality, factory, target } = req.body as TProduct;

  // Kiểm tra dữ liệu với Zod schema
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    // Trích xuất mảng lỗi
    const errorZod = result.error.issues;
    const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);

    // Giữ lại dữ liệu người dùng đã nhập để fill form lại
    const oldData = { name, price, ShortDesc, detailDesc, quality, factory, target };

    return res.render("admin/product/create-product", {
      errors,
      oldData,
    });
  }

  // Lấy tên file ảnh upload (nếu có)
  // Lưu ý: req.file.fieldname là tên trường input (ví dụ: "image"), chứ không phải tên file
  // Bạn nên dùng req.file.filename mới đúng tên file được lưu bởi multer
  const image = req.file?.filename ?? undefined;

  await handleCreateProduct(
    name,
    +price,
    detailDesc,
    ShortDesc,
    +quality,
    factory,
    target,
    image
  );

  return res.redirect("/admin/product");
};

// DELETE PRODUCT
const postDeleteProductPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("Missing product ID");
      return;
    }

    await handleDeleteProduct(id);

   return res.redirect("/admin/product");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
};
// VIEW PRODUCT
const postViewProductPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send("Missing product ID");
      return;
    }

    const product = await handleViewProduct(id);

    const factoryOptions = [
      { name: "Apple (MacBook)", value: "APPLE" },
      { name: "Asus", value: "ASUS" },
      { name: "Lenovo", value: "LENOVO" },
      { name: "Dell", value: "DELL" },
      { name: "LG", value: "LG" },
      { name: "Acer", value: "ACER" },
    ];

    const targetOptions = [
      { name: "Gaming", value: "GAMING" },
      { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
      { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
      { name: "Mỏng nhẹ", value: "MONG-NHE" },
      { name: "Doanh nhân", value: "DOANH-NHAN" },
    ];

   return res.render("admin/product/view-product", {
      id,
      product,
      factoryOptions,
      targetOptions,
    });
  } catch (error) {
    console.error("Error in postViewProductPage:", error);
    res.status(500).send("Internal Server Error");
  }
};
//UPDATE PRODUCT
const postUpdateProductPage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send("Missing product ID in URL.");
      return;
    }

    const { name, price, detailDesc, ShortDesc, quality, factory, target } =
      req.body as TProduct;

    // ✅ Kiểm tra với Zod schema
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
      // ❌ Nếu lỗi, render lại form với lỗi và dữ liệu cũ
      const errorZod = result.error.issues;
      const errors = errorZod.map(item => `${item.message} (${item.path[0]})`);

      const oldData = { name, price, detailDesc, ShortDesc, quality, factory, target };

      const product = await handleViewProduct(id); // cần product để lấy lại ảnh đã có

      const factoryOptions = [
        { name: "Apple (MacBook)", value: "APPLE" },
        { name: "Asus", value: "ASUS" },
        { name: "Lenovo", value: "LENOVO" },
        { name: "Dell", value: "DELL" },
        { name: "LG", value: "LG" },
        { name: "Acer", value: "ACER" },
      ];

      const targetOptions = [
        { name: "Gaming", value: "GAMING" },
        { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
        { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
        { name: "Mỏng nhẹ", value: "MONG-NHE" },
        { name: "Doanh nhân", value: "DOANH-NHAN" },
      ];

      return res.render("admin/product/view-product", {
        id,
        product: { ...product, ...oldData }, // cập nhật lại dữ liệu nhập vào
        errors,
        factoryOptions,
        targetOptions,
      });
    }

    const image = req.file?.filename ?? "";

    await handleUpdateProduct(
      id,
      name,
      +price,
      detailDesc,
      ShortDesc,
      +quality,
      factory,
      target,
      image
    );

    return res.redirect("/admin/product");
  } catch (error) {
    console.error("Error in postUpdateProductPage:", error);
    res.status(500).send("Internal Server Error");
  }
};

export {
    getCreateProductPage,
    postCreateProductPage,
    postDeleteProductPage,
    postViewProductPage,
    postUpdateProductPage
}
