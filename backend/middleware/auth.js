import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
  const token = req.headers.token;  // ✅ correct way

  if (!token) {
    return res.json({ success: false, message: 'Not Authorised, Login Again' });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id; // attach userId to request
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
