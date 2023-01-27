const fs = require("fs/promises");

/**
 * This api works with json file using the fs module.
 * @class
 */
class FsApi {
  // A class, used as base shape for documents
  Model;
  // Internal memory documents storage
  documents;
  // Current db address
  dbPath;
  // Controls automatic saving to fs on write operations
  autoSave;

  /**
   * Setup api and load data from json database file.
   * @param {class} Model - A class, used as base shape for documents.
   * @param {string} jsonFilePath - json db file address.
   * @param {boolean} [autoSave] - Controls automatic saving to fs on write operations.
   */
  init(Model, jsonFilePath, autoSave = true) {
    this.Model = Model;
    this.dbPath = jsonFilePath;
    this.autoSave = autoSave;
    fs.readFile(jsonFilePath, { encoding: "utf-8" })
      .then(this.parseRawData.bind(this))
      .then(this.#setDocuments.bind(this));
  }

  /** Sets documents propery value */
  #setDocuments(documents) {
    this.documents = documents;
  }

  /** Converts raw string to array of documents */
  parseRawData(data) {
    return JSON.parse(data).map((document) => new this.Model(document));
  }

  /** Saves documents to file */
  async save() {
    const data = JSON.stringify(this.documents, null, 2);
    await fs.writeFile(this.dbPath, data);
  }

  /** Returns all documents */
  getAll() {
    return this.documents;
  }

  /** Returns a single document by index */
  getByIdx(idx) {
    return this.documents[idx];
  }

  /**
   * Adds a document with the validation of params
   * Can throw validation error
   */
  async add(params) {
    params.id = this.findNextEmptyId();
    const document = new this.Model(params);
    this.documents.push(document);
    this.documents.sort((a, b) => a.id - b.id);
    if (this.autoSave) await this.save();
    return document;
  }

  /**
   * Updates document by index with params validation
   * Can throw validation error
   */
  async updateByIdx(idx, params) {
    params = { ...params, id: this.documents[idx].id };
    // I decided to update documents immutably
    this.documents[idx] = new this.Model(params);
    if (this.autoSave) await this.save();
    return this.documents[idx];
  }

  /** Removes a document by index */
  async removeByIdx(idx) {
    this.documents.splice(idx, 1);
    if (this.autoSave) await this.save();
  }

  /** Finds document by provided field and it's value */
  findIdxByField(name, value, comparator) {
    const idx = this.documents.findIndex(
      (c) => comparator?.(c[name], value) ?? c[name] === value
    );
    return idx;
  }

  /** Calculates the first empty id value */
  findNextEmptyId() {
    let id = 1;
    for (const document of this.documents) {
      if (id < document.id) return id;
      id = document.id + 1;
    }
    return id;
  }
}

/**
 * Holds the current {@link FsApi} instance.
 *
 * Provides access to the api infrastructure and meant to be used by services
 */
const api = new FsApi();

module.exports = api;
