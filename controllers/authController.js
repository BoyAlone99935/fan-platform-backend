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
        secure: true,
        sameSite: none,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })


    await sendWelcomeEmail(user)

    res.status(StatusCodes.CREATED).json({
        status : "success",
        message : "fan club joined succesfully",
        user,
    })
       
}


/*const login = async (req, res) => {
    console.log("LOGIN HIT");

    return res.json({
        success: true,
        body: req.body
    });
};*/

/*const login = async (req , res) => {
    console.log("LOGIN HIT")
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
            secure: true,
            sameSite: none,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.status(StatusCodes.OK).json({
        status : "success",
        message : `welcome back ${user.username}`,
        user,
    })
  }


}*/


const login = async (req, res) => {
    console.log("🔥 LOGIN HIT");

    const { email, password } = req.body;
    console.log("1️⃣ Request body received");

    if (!email || !password) {
        console.log("❌ Missing email or password");
        throw new BadRequestError("please provide email and password");
    }

    console.log("2️⃣ Looking for user...");
    const user = await User.findOne({ email });
    console.log("3️⃣ User lookup complete");

    if (!user) {
        console.log("❌ User not found");
        throw new BadRequestError("invalid credentials");
    }

    console.log("4️⃣ Comparing password...");
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );
    console.log("5️⃣ Password comparison complete");

    if (!isPasswordCorrect) {
        console.log("❌ Password incorrect");
        throw new BadRequestError("invalid credentials");
    }

    console.log("6️⃣ Creating JWT...");
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    console.log("7️⃣ JWT created");

    console.log("8️⃣ Setting cookie...");
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("9️⃣ Cookie set");

    console.log("🔟 Sending response...");
    res.status(StatusCodes.OK).json({
        status: "success",
        message: `welcome back ${user.username}`,
        user,
    });

    console.log("✅ Login completed successfully");
};



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






