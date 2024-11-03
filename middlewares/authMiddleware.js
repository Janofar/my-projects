const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(200).render('home');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(200).render('home');
  }
};

exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate("role");

      if (!user || !user.role) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (user.isAdmin || user.role.permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
};
