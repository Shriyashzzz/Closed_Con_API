import app from "./app.js";
import config from "./config/config.js";

app.listen(config.PORT, () => {
  config.ENV == "DEV"
    ? console.log(`live: https://localhost:${config.PORT}`)
    : console.log(`Server live on Port: ${config.PORT} `);
});
