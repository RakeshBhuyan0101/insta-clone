import jwt from "jsonwebtoken";

export  const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "User not authenticated ",
        success: false,
      });
    }
    const decodeData = await jwt.verify(token, process.env.JWt_SECRETE_KEY);
    if (!decodeData) {
      return res.status(400).json({
        message: "Internal server Error ",
        success: false,
      });
    }
    req.id = decodeData.userId;
    next();
  } catch (error) {
    console.log('errror in isAuthenticated middle ware' , error)
    return res.status(404).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
