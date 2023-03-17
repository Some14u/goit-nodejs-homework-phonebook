/** @typedef {import("../models/user.model").UserType} UserType */
const { URL } = require("url");
const path = require("path");
const api = require("../models/user.model");
const {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} = require("../helpers/errors");
const settings = require("../helpers/settings");
const messages = require("../helpers/messages");
const { filterObj } = require("../helpers/tools");
const avatar = require("../repositories/avatar.repo");
const emailService = require("./email.service");
const jwt = require("../repositories/jwt.repo");

class UserService {
  /**
   * Searches a user matching email
   * @param {string} email an email of cuser to be returned
   * @throws {NotFoundError}
   * @returns {Promise<UserType>}
   */
  getByEmail(email) {
    return api.findOne({ email }).orFail(new NotFoundError());
  }

  /**
   * Searches a user matching id
   * @param {ObjectId} id id of the user to search
   * @throws {NotFoundError}
   * @returns {Promise<UserType>}
   */
  getById(id) {
    return api.findById(id).orFail(new NotFoundError());
  }

  /**
   * Adds a new user using data, provided in **params**.
   * Checks the database for anoter user with the same name.
   * Sends an email verification request to user's email.
   * @param params an object, containing **email** and **password** fields
   * (**subscription** and **token** are optional).
   * @returns {Promise<UserType>}
   * @throws {ExistError} Note, that this error is actually thrown by interceptErrors middleware
   * in [User model module](../models/user.model.js).
   */
  async signup(params) {
    const token = await emailService.generateVerificationToken(params.email);
    const user = await api.create({ ...params, verificationToken: token });
    await emailService.sendVerificationEmail(params.email, token);
    return user;
  }

  /**
   * Generates a new email verification token and resends request to user's email.
   *
   * Checks the database if user exists, and makes sure it hasn't been yet verified.
   *
   * It is important to always generate fresh token because the old token may had
   * been expired.
   * @param {string} email
   * @returns {Promise<UserType>}
   * @throws {NotFoundError|ValidationError}
   */
  async reverifyEmail(email) {
    const user = await this.getByEmail(email);

    // Throw if user has already been verified
    if (user.verify) {
      throw new ValidationError(messages.emailVerification.beenPassed);
    }
    // Generate new token
    const token = await emailService.generateVerificationToken(email);

    // Update user
    user.verificationToken = token;
    user.save();

    // Resend verification email with new token
    await emailService.sendVerificationEmail(email, token);

    return user;
  }

  /**
   * Sign in user using credentials
   * Checks if user has already verified their email.
   *
   * Returns user with new token assigned
   * @param {string} email user email
   * @param {string} password user password
   * @return {Promise<UserType>}
   */
  async signin(email, password) {
    let user = await api
      .findOne({ email })
      .orFail(new UnauthorizedError(messages.users.signinError));

    const passwordsAreEqual = await user.comparePassword(password);
    if (!passwordsAreEqual) {
      throw new UnauthorizedError(messages.users.signinError);
    }

    // Check if user has passed email verification
    if (!user.verify) {
      throw new UnauthorizedError(messages.emailVerification.notVerifiedEmail);
    }

    const payload = filterObj(user, [["_id", "id"], "email", "subscription"]);

    const token = await jwt.sign(
      payload,
      settings.authentication.jwt.lifeTime.auth
    );

    user = await this.updateById(user.id, { token });

    return user;
  }

  /**
   * Updates user fields
   * @param {ObjectId} id id of the user to be updated
   * @param param object with fields and values to update
   * @returns {Promise<UserType>}
   * @throws {NotFoundError|ExistError} could possibly throw ExistError if you're updating the email field and the database already has it.
   */
  updateById(id, param) {
    return api
      .findByIdAndUpdate(id, param, { new: true })
      .orFail(new NotFoundError());
  }

  /**
   * Updates user fields
   * @param {ObjectId} id id of the user to be updated
   * @param {string} source a full path (with name) to the file to process with
   * @returns {Promise<string>}
   * @throws {NotFoundError}
   */
  async updateAvatarById(id, source) {
    // Setup paths
    const parsedPath = path.parse(source);
    const relative = path.join(settings.avatar.folder, parsedPath.base);
    const avatarURL = new URL("file:" + relative).pathname;
    const destination = path.resolve(settings.folders.public, relative);

    // Move the image to the public folder and wipe out from tmp
    await avatar.resizeAndMove(source, destination, settings.avatar.size);

    // Update the user avatarURL with new value
    // I'm using api expicitly because i need the old avatar url
    const { avatarURL: oldAvatarURL } = await api
      .findByIdAndUpdate(id, { avatarURL })
      .orFail(new NotFoundError());

    // Delete the old avatar if it exists
    await avatar.deleteByUrl(oldAvatarURL);

    return avatarURL;
  }

  /**
   * Activates user account after checking various conditions.
   *
   * The main purpose of this function is to validate the email
   * verification token. The same exact token supposed to be stored
   * in the database during the email verification phase of registration.
   * @param {string} token an email comfirmation token. This is a jwt token containing email of user to be activated.
   * @throws {NotFoundError|ValidationError}
   * @returns {Promise<UserType>}
   */
  async activateAccount(token) {
    const errMsg = messages.emailVerification;

    // Check the token. It may expire and throw an error
    const payload = await jwt.verify(token).catch(() => {
      throw new ValidationError(errMsg.wrongToken);
    });

    // Get the user. Throws NotFoundError
    let user = await this.getByEmail(payload.email);

    // Throw if user has already been verified
    if (user.verify) throw new ValidationError(errMsg.beenPassed);

    // Check provided and user tokens equality
    const tokensAreEqual = await user.compareVerificationToken(token);

    // Throw if tokens not equal
    if (!tokensAreEqual) throw new ValidationError(errMsg.wrongToken);

    // We have passed email verification. Now it's safe to activate the user
    user = await this.updateById(user.id, {
      verificationToken: null,
      verify: true,
    });
    return user;
  }
}

module.exports = UserService;
