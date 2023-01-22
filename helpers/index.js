function ForwardedError(statusCode, message) {
  this.statusCode = statusCode;
  this.message = message;
}

module.exports = {
  ForwardedError,
}