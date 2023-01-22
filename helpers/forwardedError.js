class ForwardedError {
  statusCode;
  message;

  static notFound = [404, `Not found`];
  static exist = [409, `There is another contact with the same name`];

  /** Can be buit in three ways:
   * - explicit **statusCode** and **message** as **first** and **second** parameters
   * - an array of **statusCode** and **message** as **first** parameter
   * - one of preregistered static ForwardError message keys as a string (see above)
   */
  constructor(first, second) {
    [this.statusCode, this.message] = [first, second];
    if (second) return;
    if (Array.isArray(first)) {
      [this.statusCode, this.message] = first;
    } else if (ForwardedError[first]) {
      [this.statusCode, this.message] = ForwardedError[first];
    }
  }
}

module.exports = ForwardedError;
