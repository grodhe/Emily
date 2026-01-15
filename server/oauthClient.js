const axios = require("axios");

const TOKEN_URL = "http://localhost:8080/token";
const CLIENT_ID = "test-client";
const CLIENT_SECRET = "test-secret";
const SCOPE = "read";

async function getAccessToken() {
  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      scope: SCOPE,
    }).toString(),
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
}

module.exports = {
  getAccessToken,
};