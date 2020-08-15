import jwt from 'jsonwebtoken';
import config from 'config';

export default function (req, res, next) {
  //Get token from Header
  const token = req.header('x-auth-token');

  //check if no token
  if(!token) 
    return res.status(401).json({ msg: 'No token, authorization denied' });

  // Verify token
  try {
    jwt.verify(token, config.get('jwt_secret'), (err, decoded) => {
      if(err) {
        throw err;
      }else{
        req.user = decoded.user;
        next();
      }
    });
   
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }

}