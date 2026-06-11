const http = require("http");

function get(url) {
  return new Promise(function (resolve, reject) {
    http.get(url, function (response) {
      let body = "";
      response.on("data", function (chunk) { body += chunk; });
      response.on("end", function () {
        resolve({ status: response.statusCode, body: body });
      });
    }).on("error", reject);
  });
}

(async function () {
  try {
    const webPort = process.env.WEB_TEST_PORT || "3010";
    const adminPort = process.env.ADMIN_TEST_PORT || "3001";
    const adminOnWeb = await get("http://localhost:" + webPort + "/api/admin/session");
    console.log("web /api/admin/session:", adminOnWeb.status, adminOnWeb.body.slice(0, 60));
    const content = await get("http://localhost:" + webPort + "/api/content");
    console.log("web /api/content:", content.status);
    const adminSession = await get("http://localhost:" + adminPort + "/api/admin/session");
    console.log("admin /api/admin/session:", adminSession.status, adminSession.body.slice(0, 60));
  } catch (error) {
    console.log("Test skipped or server not running:", error.message);
  }
})();
