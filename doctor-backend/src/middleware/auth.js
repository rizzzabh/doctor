import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  // 1. Get token from the request header
  const token = req.header("x-auth-token");

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the doctor's ID from the token to the request object
    req.doctor = decoded.doctor;
    next(); // Move to the next function (the route handler)
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

export default authMiddleware;
