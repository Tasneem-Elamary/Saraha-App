import { Router } from "express";
import { deleteProfile,  getAllUsers, getShareProfile, lastseen, resetPassword, sendEmailforgetPassword, softDeleteProfile, updateProfile } from "../controllers/user.controller.js";
import { auth } from "../middleware/authentcation.js";
const router = Router()



router.put('/profile',auth(),updateProfile)
router.delete('/profile',auth(),deleteProfile)

router.get('/',getAllUsers)
router.get("/:id", getShareProfile)
router.patch('/profile/softdelete',auth(),softDeleteProfile)
router.post("/forgetpassword",auth(),sendEmailforgetPassword)
router.post("/resetpassword/:token",auth(),resetPassword)
router.get('/lastseen/:id',lastseen)
export default  router