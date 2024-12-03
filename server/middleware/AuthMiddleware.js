import jwt from 'jsonwebtoken';
console.log(`1`);
export const verifyToken = (request, response, next) => {
console.log(`2`);
console.log(`cookies`,request.cookies);
console.log(`token`,request.headers);  
const token = request.cookies.jwt || request.headers.cookie;
  
console.log(token);
  if (!token) {
    return response.status(403).json({ error: "No token provided" });
  }
console.log(`3`);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: "Unauthorized" });
    }
console.log(`4`);
    request.user = decoded; // Attach the decoded user object to the request
    console.log(decoded);
    next();
  });
};
