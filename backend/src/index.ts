import { app } from "./server.js";
import { env } from "../env.js";

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server spinning up nicely on http://localhost:${port}`);
  console.log(`🌍 Current App Stage: [ ${env.APP_STAGE} ]`);
});
