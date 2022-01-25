const JWT = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/customError");
const STRINGS = require("../utils/texts");
/**
 * If no role is passed the default role is user
 *
 * @param  {String} role role allowed to access the route
 */

function auth(role = STRINGS.ROLES.USER) {
  // roles = roles.length > 0 && roles : role.USER;

  return async (req, res, next) => {
    const header = req.get("Authorization");
    // Unauthorized access: token not found
    if (!header || !header.startsWith("Bearer")) {
      throw new CustomError("Accès non autorisé : jeton introuvable", 401);
    }
    const token = header.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ _id: decoded.id });
    // Unauthorized access: user does not exist
    if (!user)
      throw new CustomError(
        "Accès non autorisé : l'utilisateur n'existe pas",
        401
      );
    //Unauthorized access: user is no longer active
    if (user.status !== STRINGS.STATUS.ACTIVE)
      throw new CustomError(
        "Accès non autorisé : l'utilisateur n'est plus actif",
        401
      );
    // Unauthorized access: Please verify email address
    if (!user.isVerified)
      throw new CustomError(
        "Accès non autorisé : veuillez vérifier l'adresse e-mail",
        401
      );
    // console.log("roleee", role, user.role);
    if (role !== STRINGS.ROLES.ALL && role !== user.role)
      throw new CustomError("L'accès non autorisé", 401);
    req.user = user;
    req.userId = user._id;

    res.set(
      "cache-control",
      "no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0"
    );
    next();
  };
}

module.exports = auth;
