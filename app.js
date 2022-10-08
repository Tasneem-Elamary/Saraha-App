
import express from 'express';
import connectDB from "./DB/connection.js";
import * as allRouter from './routes/index.route.js'
const app = express()
const port = 3000
const baseUrl='/api/v1'
app.use(express.json())

app.use(`${baseUrl}/auth`, allRouter.authRouter)
app.use(`${baseUrl}/message`, allRouter.messageRouter)
app.use(`${baseUrl}/user`, allRouter.userRouter)


app.use('*', (req, res) => {
    res.json({ message: "In-valid routing" })
})

connectDB()
app.listen(port, () => console.log(`app listening on port ${port}!`))
