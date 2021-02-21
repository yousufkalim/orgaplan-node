const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const User = require("../models/user");
const STRINGS = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const MailService = require("../services/mail.service");
const ENV = process.env;

class AuthContoller {
  async signup(data) {
    let user = await User.findOne({ email: data.email });
    if (user) {
      // send email
      let emailService = new MailService();
      let verifyToken = crypto.randomBytes(32).toString("hex");

      //  const verifyLink = `${ENV.BASE_URL}/email-verification?uid=${user._id}&verifyToken=${verifyToken}`;
      const verifyLink = `${ENV.BASE_URL}/api/v1/users/${user._id}`;
      // await emailService.sendEmailConfirmation(user, verifyLink);
      return {
        user,
        exists: true,
      };
    } else {
      user = await new User(data).save();

      let verifyToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(verifyToken, +ENV.BCRYPT_SALT);
      //const verifyLink = `${ENV.BASE_URL}/email-verification?uid=${user._id}&verifyToken=${verifyToken}`;
      const verifyLink = `${ENV.BASE_URL}/api/v1/users/${user._id}`;

      // await new Token({
      //   userId: user._id,
      //   token: hash,
      //   createdAt: Date.now(),
      // }).save();

      // send email
      let emailService = new MailService();
      // await emailService.requestEmailVerification(user, verifyLink);

      return {
        user,
        exists: false,
      };
    }
  }

  async signin(req, res) {
    const data = req.body;
    if (!data.email) throw new CustomError(STRINGS.ERRORS.emailRequired);
    if (!data.password) throw new CustomError(STRINGS.ERRORS.passwordRequired);

    // Check if user exist
    const user = await User.findOne({ email: data.email });
    if (!user) throw new CustomError(STRINGS.ERRORS.emailInvalid);

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError(STRINGS.ERRORS.passwordInvalid);

    const token = await JWT.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET
    );

    const result = {
      user,
      token,
    };

    res.status(200).send(response(STRINGS.TEXTS.loginSuccess, result));
  }

  async getProfile(req, res) {
    const userId = req.userId;
    if (!userId) throw new CustomError(STRINGS.ERRORS.error);

    // Check if user exist
    const user = await User.findById(userId, { password: 0, __v: 0 });
    if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    const result = {
      user,
    };

    res.status(200).send(response(STRINGS.TEXTS.loginSuccess, result));
  }

  async updatePassword(req, res) {
    const userId = req.params.userId;
    const data = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.oldPassword, user.password);
    if (!isCorrect) throw new CustomError(STRINGS.ERRORS.passwordInvalid);

    const hash = await bcrypt.hash(data.password, +ENV.BCRYPT_SALT);

    const result = await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    res.status(200).send(response(STRINGS.TEXTS.passwordSuccess, result));
  }

  async RequestEmailVerification(req, res) {
    const email = req.query.email;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError(STRINGS.ERRORS.emailInvalid);
    if (user.isVerified) throw new CustomError(STRINGS.ERRORS.alreadyVerified);

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let verifyToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(verifyToken, +ENV.BCRYPT_SALT);
    const verifyLink = `${ENV.BASE_URL}/email-verification?uid=${user._id}&verifyToken=${verifyToken}`;

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    // send email
    let emailService = new MailService();
    await emailService.requestEmailVerification(user, verifyLink);

    const result = {
      userId: user._id,
    };

    res.status(200).send(response(STRINGS.TEXTS.emailVerificationSent, result));
  }

  async VerifyEmail(req, res) {
    const { userId, verifyToken } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError(STRINGS.ERRORS.userNotFound);
    if (user.isVerified) throw new CustomError(STRINGS.ERRORS.alreadyVerified);

    let VToken = await Token.findOne({ userId });
    if (!VToken) throw new CustomError(STRINGS.ERRORS.invalidToken);

    const isValid = await bcrypt.compare(verifyToken, VToken.token);
    if (!isValid) throw new CustomError(STRINGS.ERRORS.invalidToken);

    await User.updateOne(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true }
    );

    await VToken.deleteOne();

    // send email
    let emailService = new MailService();
    await emailService.sendEmailConfirmation(user);

    const token = await JWT.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET
    );

    const result = {
      user,
      token,
    };

    res.status(200).send(response(STRINGS.TEXTS.emailVerified, result));
  }

  async RequestPasswordReset(req, res) {
    const email = req.query.email;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError(STRINGS.ERRORS.emailInvalid);

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, +ENV.BCRYPT_SALT);
    const verifyLink = `${url.CLIENT_URL}/reset-password?uid=${user._id}&resetToken=${resetToken}`;

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    // send email
    let emailService = new MailService();
    await emailService.requestResetPassword(user, verifyLink);

    const result = {
      userId: user._id,
    };

    res.status(200).send(response(STRINGS.TEXTS.passwordResetSent, result));
  }

  async resetPassword(req, res) {
    const { userId, resetToken, password } = req.body;

    let RToken = await Token.findOne({ userId });
    if (!RToken) throw new CustomError(STRINGS.ERRORS.invalidToken);

    const isValid = await bcrypt.compare(resetToken, RToken.token);
    if (!isValid) throw new CustomError(STRINGS.ERRORS.invalidToken);

    const hash = await bcrypt.hash(password, +ENV.BCRYPT_SALT);

    const user = await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await RToken.deleteOne();

    // send email
    let emailService = new MailService();
    await emailService.sendPasswordResetConfirmation(user);

    const result = {
      userId: userId,
    };

    res.status(200).send(response(STRINGS.TEXTS.passwordSuccess, result));
  }
}

module.exports = new AuthContoller();
