import app from "./app";
import { env, logger } from "./utils";

logger.info("Starting the backend server...");
app.listen(env.PORT, () => logger.info(`Running on port "${env.PORT}"`));
