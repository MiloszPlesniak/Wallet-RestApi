const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server running. Use our API on port: ${port}`);
});
