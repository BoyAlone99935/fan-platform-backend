const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const BadRequestError = require('../errors/BadRequestError')
const sendWelcomeEmail = require('../utils/sendEmail')
require('dotenv').config()
const {statusCodes, StatusCodes} = require('http-status-codes')
 
const register = async (req , res) => {
    const { username , email , password }  = req.body

    
    if (!username || !email || !password) {
        throw new BadRequestError('please provide all details')
    }

    const existingEmail = await User.findOne({email})
    const existingUsername = await User.findOne({username})
    
    if (existingEmail) {
        throw new BadRequestError("This email already exists")
    }

    if (existingUsername) {
        throw new BadRequestError("This username is taken")
    }

    
    const hashedPassword = await bcrypt.hash(password , 10)

    const user = await User.create({
        username,
        email,
        password : hashedPassword
    })

    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    )


    res.cookie("token" , token , {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    await sendWelcomeEmail(user)

    res.status(StatusCodes.CREATED).json({
        status : "success",
        message : "fan club joined succesfully",
        user,
    })
       
}




const login = async (req , res) => {
   const {email , password} = req.body

   if (!email || !password) {
    throw new BadRequestError("please provide email and password")
   }

  const user = await User.findOne({email})

  if (!user) {
    throw new BadRequestError('invalid credentials')
  }


  const isPasswordCorrect =  await bcrypt.compare(
    password , user.password
  )

  if (!isPasswordCorrect) {
    throw new BadRequestError('invalid credentials')
  } else {
    const token = jwt.sign(
      {userId : user._id},
      process.env.JWT_SECRET,
      {expiresIn : "7d"}
    )


    res.cookie(
         "token" , token , {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.status(StatusCodes.OK).json({
        status : "success",
        message : `welcome back ${user.username}`,
        user,
    })
  }


}



const logout = async (req, res) => {

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Logged out successfully"
    });

};






module.exports = {
    register,
    login,
    logout
}






