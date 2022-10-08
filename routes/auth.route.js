import { Router } from "express";
import { confirmEmail,  getAccessTokenFromRefreshtoken,  signIn, signOut, signup } from "../controllers/auth.controller.js";
import { auth } from "../middleware/authentcation.js";
const router = Router()

router.post('/signup',signup)
router.get('/confirmEmail/:token',confirmEmail)
router.post('/signin',signIn)
router.patch('/signout',auth(),signOut)
router.post('/token',getAccessTokenFromRefreshtoken)


export default  router