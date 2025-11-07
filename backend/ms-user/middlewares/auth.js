import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  console.log('Headers:', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    console.log('User:', user);
    next();
  });
};


export default authenticateToken;
