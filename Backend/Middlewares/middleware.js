const { getuser } = require('../controllers/authcontroller');

function checkforAuthentication(req, res, next) {
  let useruid = req.cookies.uid;

  // Check Authorization header if cookie not found
  if (!useruid) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      useruid = authHeader.substring(7);
    }
  }

  if (!useruid) {
    return next();
  }

  const user = getuser(useruid);
  req.user = user;
  next();
}

function restrictTO(roles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    return next();
  };
}

async function restricttologgedinuseronly(req, res, next) {
  let useruid = req.cookies.uid;

  // Check Authorization header if cookie not found
  if (!useruid) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      useruid = authHeader.substring(7);
    }
  }

  if (!useruid) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = getuser(useruid);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid session' });
  }

  req.user = user;
  next();
}

function restrictToAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  return next();
}

module.exports = restricttologgedinuseronly;
module.exports.checkforAuthentication = checkforAuthentication;
module.exports.restrictTO = restrictTO;
module.exports.restrictToAdmin = restrictToAdmin;