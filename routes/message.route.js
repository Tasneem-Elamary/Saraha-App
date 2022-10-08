import { Router } from "express";
import { AllMessages, deleteMessage, sendMessage } from "../controllers/message.controller.js";
import { auth } from "../middleware/authentcation.js";
const router = Router()


router.get("/:userId", AllMessages)


router.post("/:userId",auth(), sendMessage)

router.delete("/:id", auth(), deleteMessage)



export default  router