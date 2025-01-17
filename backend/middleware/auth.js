import jwt from "jsonwebtoken"

// to add remove and get data from card
const authMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    if (!token) {
        return res.json({success: false, message: "Not Authorized Login Again"})
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)  // we decode for get id of user{userController: line 31}
        req.body.userId = token_decode.id;
        next();

    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}

export default authMiddleware;