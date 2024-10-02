import jwt from 'jsonwebtoken';

export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt || request.headers.authorization?.split(' ')[1];

  if (!token) {
    return response.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    request.user = decoded; // Attach the decoded user object to the request
    next();
  });
};
