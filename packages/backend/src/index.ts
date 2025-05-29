import { env, logger } from "./utils";
import app from "./app";

logger.info("Starting the backend server...");
app.listen(env.PORT, () => logger.info(`Running on port "${env.PORT}"`));
