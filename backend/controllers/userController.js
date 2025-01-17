import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"         // to encrypt password
import validator from "validator"

// register User
const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        // checking is user already exists
        const exists =  await userModel.findOne({email});
        if (exists) {
            return res.json({success: false, message: "User already exists"})
        } 

        // validation email formate and strong password
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email"})
        }

        // check pass length
        if (password.length < 8) {
            return res.json({success: false, message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email, 
            password: hashedPassword
        })
        const user = await newUser.save()
        const token  = createToken(user._id)
        res.json({success: true, token})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success: false, message: "User Doesn't exists"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({success: false, message: "Invalid credential"});
        }

        const token = createToken(user._id);
        res.json({success: true, token});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}    



export {loginUser, registerUser};