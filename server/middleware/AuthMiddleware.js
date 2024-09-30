import jwt from 'jsonwebtoken';

// Middleware to verify JWT
export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt; 

  if (!token) {
    return response.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: "Unauthorized" });
    }
    
    // Store the decoded user object in the request object
    request.user = decoded; 

    next(); 
  });
}; 
