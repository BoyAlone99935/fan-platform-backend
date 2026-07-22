const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const ErrorHandlerMiddleware = require('./middleware/errormiddleware')
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profile")
const eventRoutes = require('./routes/eventRoutes')
const meetAndGreetRoutes = require('./routes/meetAndGreetRoutes')
const RequestRoutes = require('./routes/requestRoutes')
const TicketRoutes = require('./routes/ticketRoutes')
const qrCodeRoute = require('./routes/qrCodeRoute')
const userRoute = require('./routes/userRoute')
const BankRoutes = require('./routes/bankRoutes')
const passport = require('passport')
const session = require("express-session")
require('./config/passport')
const app = express()


app.use(cors({
  origin: [
    "https://heroic-taiyaki-ad9c92.netlify.app",
    "http://localhost:5174"
  ],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())
app.use(
    session({
        secret: "fanclubsecret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize())
app.use(passport.session())

//Test route

app.get("/" , (req , res) => {
    res.json({message:"application is running"})
})

app.use('/api/auth' , authRoutes)
app.use('/api/celebrities' , profileRoutes)
app.use(
    "/api/v1/events",
    eventRoutes
);
app.use('/api/v1/meet-and-greets' , meetAndGreetRoutes)
app.use('/api/v1/booking' , RequestRoutes)
app.use('/api/v1/tickets' , TicketRoutes)
app.use('/qr' , qrCodeRoute)
app.use('/user' , userRoute)
app.use(
  "/api/v1/payment-methods",
  BankRoutes
);
app.use(ErrorHandlerMiddleware)
module.exports = app