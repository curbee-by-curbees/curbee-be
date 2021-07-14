import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  let { session } = req.cookies;
  session = session || req.body.jwt || req.headers.authorization; // if there's no cookies, check the body or the headers.authorization
  const payload = jwt.verify(session, process.env.APP_SECRET);
  req.user = payload;
  next();
}
