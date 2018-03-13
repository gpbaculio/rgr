import jwt from 'jsonwebtoken';
import User from './models/User';
const jwtSecret = 'iamgpbaculio';

export async function getUser(token) {
  if (!token) {
    return ({user: null});
  }
  try {
    const decodedToken = jwt.verify(token.substring(7), jwtSecret);
    const user = await User.findOne({_id: decodedToken.id});
    return ({user});
  } catch (err) {
    return ({user: null});
  }
}

export function generateToken(user) {
  return `Bearer ${jwt.sign({id: user.id}, jwtSecret)}`;
}