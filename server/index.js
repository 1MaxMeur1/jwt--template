require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleWare = require('./middleware/error-middleware')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use('/api', router)
app.use(errorMiddleWare)

const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`The server has been started in ${PORT} port...`))
    } catch(e) {
        console.log(e.message)
    }
}

start()