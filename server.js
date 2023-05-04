const app = require("./app");
const dotenv = require("dotenv");

const path = require("path");
const createFolderIfNotExist = require("./helpers/checkFolderIsExist");
dotenv.config();

app.listen(3000, async () => {
  await createFolderIfNotExist(path.join(process.cwd(), "tmp"));
  await createFolderIfNotExist(path.join(process.cwd(), "public"));
  await createFolderIfNotExist(path.join(process.cwd(), "public", "avatars"));
  console.log("Server running. Use our API on port: 3000");
});
