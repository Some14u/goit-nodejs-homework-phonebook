/** @typedef {import("../models/contact.model").ContactType} ContactType */
/** @typedef {{page?: number, limit?: number, favorite?: boolean}} GetAllParamsType */
const { ExistError, NotFoundError } = require("../helpers/errors");
const api = require("../models/contact.model");
const messages = require("../helpers/messages");
const { defaultPageSize } = require("../helpers/settings");

class ContactService {
  owner;

  /**
   * Binds the current service to specific owner id. All methods will use
   * this.owner to filter their output.
   * @param {ObjectId} id an owner user objectId
   * @throws {NotFoundError}
   */
  setOwnerId(id) {
    this.owner = id;
  }

  /**
   * Returns a list of all contacts in the database
   * @param {GetAllParamsType} params **page** and **limit** control pagination,
   * wherethere **favorite** works like an optional filter.
   * @throws {NotFoundError}
   * @returns {Promise<[ContactType]>}
   */
  getAll({ page, limit, favorite } = {}) {
    limit ??= page && defaultPageSize;

    const query = api.find({ owner: this.owner });

    if (typeof favorite === "boolean") query.where({ favorite });

    if (page) query.skip(page * limit - limit);
    if (limit) query.limit(limit);

    return query.orFail(new NotFoundError());
  }

  /**
   * Searches a contact matching id
   * @param {ObjectId} id id of contact to be returned
   * @throws {NotFoundError}
   * @returns {Promise<ContactType>}
   */
  getById(id) {
    return api.findOne(this.#idFilter(id)).orFail(new NotFoundError());
  }

  /**
   * Removes a contact matching id
   * @param {ObjectId} id id of contact to be removed
   * @throws {NotFoundError}
   */
  removeById(id) {
    api.findOneAndDelete(this.#idFilter(id)).orFail(new NotFoundError());
  }

  /**
   * Adds a new contact using data, provided. The **id** is generated internally.
   * Checks the database for anoter contact with the same name.
   * @param params an object, containing **name**, **email**, and **phone** fields (**favorite** is optional).
   * @throws {ExistError}
   * @returns {Promise<ContactType>}
   */
  async add(params) {
    const match = await api.findOne(this.#nameFilter(params.name));
    if (match) throw new ExistError(messages.contacts.exist(params.name));

    // Remember to add the current owner
    params.owner = this.owner;

    return api.create(params);
  }

  /**
   * Updates existing contact matching id, using data, provided.
   * Checks the database for anoter contact with the same name.
   * @param {ObjectId} id id of contact to be updated
   * @param params an object, containing **name**, **email**, and **phone** fields (**favorite** is optional).
   * @throws {NotFoundError|ExistError}
   * @returns {Promise<ContactType>}
   */
  async updateById(id, params) {
    if (params.name) {
      // Check if there is the same name already in the database(with another id)
      const match = await api.findOne(this.#nameFilter(params.name));
      if (match && match.id !== id)
        throw new ExistError(messages.contacts.exist(params.name));
    }
    return api
      .findOneAndUpdate(this.#idFilter(id), params, { new: true })
      .orFail(new NotFoundError());
  }

  /** A small query filter matches current owner's document with specified id */
  #idFilter(id) {
    return { _id: id, owner: this.owner };
  }

  /**
   * A query filter, tests names for equality by splitting them to words
   * and then testing for symmetric difference of those two word sets.
   *
   * The test is case insensitive.
   *
   * Basically, it works in the way that "Bob Ross" and "ROSS bob" considered equal.
   * @param {string} name a name to filter with
   */
  #nameFilter(name) {
    const nameParts = name.toLocaleLowerCase().split(" ");
    return {
      owner: this.owner,
      $expr: {
        $setEquals: [nameParts, { $split: [{ $toLower: "$name" }, " "] }],
      },
    };
  }
}

module.exports = ContactService;
