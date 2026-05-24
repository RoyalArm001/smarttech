module.exports = function handler(request, response) {
  response.setHeader("cache-control", "no-store");
  response.status(204).end();
};
