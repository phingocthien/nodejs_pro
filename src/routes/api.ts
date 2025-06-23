import express,{Express} from "express"
import { deleteUserApi, getAllUserApi, getUserIdApi, postCreateUserApi, postLogInApi, putUserApi } from "../controllers/client/api.controller"
import { checkValidJwt } from "../middleware/jwt"
const router = express.Router()
const apiRoutes = (app:Express) =>{
   router.get("/get-all-users",checkValidJwt,getAllUserApi)
   router.get("/get-users/:id", getUserIdApi )
   router.post("/create-users",postCreateUserApi)
   router.put("/update-users/:id",putUserApi)
   router.delete("/delete-users/:id",deleteUserApi)
   router.post("/login",postLogInApi)
    app.use("/api", router)
}
export default apiRoutes