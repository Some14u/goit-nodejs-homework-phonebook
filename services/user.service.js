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
const jwt = require("../repositories/jwt.repo");
const mailer = require("../repositories/mailer.repo");
const emailService = require("./email.service");

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
   * @param params an object, containing **email** and **password** fields
   * (**subscription** and **token** are optional).
   * @returns {Promise<UserType>}
   * @throws {ExistError} Note, that this error is actually thrown by interceptErrors middleware
   * in [User model module](../models/user.model.js).
   */
  add(params) {
    return api.create(params);
  }

  // TODO description
  async signup(user) {
    const verificationToken = jwt.sign(
      { email: user.email },
      settings.authentication.jwt.lifeTime.emailConfirmation
    );
    await this.add({ ...user, verificationToken });
    await emailService.sendConfirmationEmail(user.email, verificationToken);
  }

  /**
   * Sign in user using credentials
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

  async activateAccount(token) {
    const errMsg = messages.users.emailVerification;

    // Check the token. It may expire and throw an error
    const payload = await jwt.verify(token).catch((err) => {
      throw new ValidationError(err.wrongToken);
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
    // TODO add login check
    user = await this.updateById(user.id, {
      verificationToken: null,
      verify: true,
    });
  }
}

module.exports = UserService;
