const app = require("./app");
const dotenv = require("dotenv");

const path = require("path");

dotenv.config();

app.listen(3000, async () => {
  console.log("Server running. Use our API on port: 3000");
});
