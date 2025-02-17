import jwt from 'jsonwebtoken'
export const isLogin=async (req,res,next) => {
    try {
        const token=req.headers?.authorization.split(' ')[1]
        const {role,id}=jwt.verify(token,process.env.SECRET_JWT)
        req.userId=id
        req.role=role
        return next()
       
    } catch (error) {
        return res.status(401).json({
            message:'you dont have permission',
            success:false
        })
    }
}