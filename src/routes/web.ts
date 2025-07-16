import express, { Express } from "express";
import {
  getUserHomePage,
  getCreateUserPage,
  postCreateUserPage,
  postDeleteUserPage,
  postUpdateUserPage,
  postViewUserPage,
} from "../controllers/admin/user.controller";
import {
  getAdmin,
  getDashBoardHomePage,
  getOrderHomePage,
  getProductHomePages,
} from "../controllers/admin/dashboard.controller";

import fileUploadMiddleware from "../middleware/multer";
import {
  getHomePage,
  postAddProductToCart,
} from "../controllers/client/productHome.controller";
import {
  getProductDetail,
  postAddDetailCart,
} from "../controllers/client/productDetail.controller";
import {
  getCreateProductPage,
  postCreateProductPage,
  postDeleteProductPage,
  postUpdateProductPage,
  postViewProductPage,
} from "../controllers/admin/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  postLogOut,
  postRegisterPage,
  redirectAdmin,
} from "../controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLoggedIn } from "../middleware/auth";
import {
  deleteProductCart,
  getCartPage,
  getCheckOutPage,
  getPlaceOrder,
  postPlaceOrder,
  postQuantityBeforeUpdate,
} from "../controllers/client/productCart.controller";
import { getOrderHistory } from "../controllers/client/orderHistory.controller";
import { postViewOrderPage } from "../controllers/admin/order.controller";
import {
  getProductFilterPage,
  postAddProductFilter,
} from "../controllers/client/productFilter.controller";

const router = express.Router();
const webRoutes = (app: Express) => {
  //client hommPage
  router.get("/", getHomePage);
  router.get("/product/:id", getProductDetail);
  router.get("/product", getProductFilterPage);
  // login - register
  router.get("/success-redirect", redirectAdmin);
  router.get("/login", getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect", // ✅ chuyển hướng khi login thành công
      failureRedirect: "/login", // ❌ quay lại login khi sai
      failureMessage: true, // ✅ lưu thông báo lỗi vào req.session.messages
    })
  );
  router.post("/logout", postLogOut);
  router.get("/register", getRegisterPage);
  router.post(
    "/register",
    fileUploadMiddleware("avatar", "images/user"),
    postRegisterPage
  );

  // cart
  router.post("/add-product-to-cart/:id", postAddProductToCart);
  router.get("/cart", getCartPage);
  router.post("/delete-product-cart/:id", deleteProductCart);
  router.post("/update-quantity-before-checkout", postQuantityBeforeUpdate);
  router.get("/checkout", getCheckOutPage);
  router.post("/place-order", postPlaceOrder);
  router.get("/thank", getPlaceOrder);
  router.get("/order-history", getOrderHistory);

  router.post("/add-product-detail/:id", postAddDetailCart);
  router.post("/add-product-filter/:id", postAddProductFilter);

  //  router.get("/checkout",getCheckOut)
  // admin
  router.get("/admin", getAdmin);
  router.get("/admin/dashboard", getDashBoardHomePage);

  // admin-order
  router.get("/admin/order", getOrderHomePage);
  router.post("/admin/order/:id", postViewOrderPage);

  // admin-product
  router.get(
    "/admin/product",
    fileUploadMiddleware("image", "images/product"),
    getProductHomePages
  );
  router.get(
    "/admin/product/create-product",
    fileUploadMiddleware("image", "images/product"),
    getCreateProductPage
  ),
    router.post(
      "/admin/product/handle-create-product",
      fileUploadMiddleware("image", "images/product"),
      postCreateProductPage
    ); // Xử lý tạo user
  router.post("/admin/product/view-product/:id", postViewProductPage);
  router.post(
    "/admin/product/update/:id",
    fileUploadMiddleware("image", "images/product"),
    postUpdateProductPage
  );

  // Xử lý xem user (có upload file avatar)

  router.post(
    "/admin/handle-update-user",
    fileUploadMiddleware("avatar"),
    postUpdateUserPage
  ); // Cập nhật user
  router.post(
    "/admin/product/handle-delete-product/:id",
    postDeleteProductPage
  ); // Xóa product

  // admin-user
  router.get("/admin/user", getUserHomePage); // Danh sách user
  router.get("/admin/user/create-user", getCreateUserPage); // Trang tạo user

  router.post(
    "/admin/user/handle-create-user",
    fileUploadMiddleware("avatar", "images/user"),
    postCreateUserPage
  ); // Xử lý tạo user
  //"/admin/user/handle-create-user" => fileUploadMiddleware("avatar")=>  postCreateUserPage) :xử lý
  router.post("/admin/user/view-user/:id", postViewUserPage); // Xử lý xem user (có upload file avatar)

  router.post(
    "/admin/handle-update-user/:id",
    fileUploadMiddleware("avatar", "images/user"),
    postUpdateUserPage
  ); // Cập nhật user
  router.post("/admin/user/handle-delete-user/:id", postDeleteUserPage); // Xóa user

  app.use("/", isAdmin, router);
};
export { webRoutes };
