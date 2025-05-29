import cors from "cors";
import express, {
	json,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import createHttpError, { isHttpError } from "http-errors";
import {
	AuthenticationRouter,
	TagRouter,
	CreatorRouter,
	PostRouter,
	ImportQueueRouter,
} from "./routes";
import { logger } from "./utils";
import path from "node:path";

const app = express();

app.use(
	express.static(path.join(__dirname, "../../frontend/dist/frontend/browser")),
);
app.use(cors());
app.use(json({ limit: "7mb" }));

const apiRouter = express.Router();

apiRouter.use("/authentication", AuthenticationRouter);
apiRouter.use("/tags", TagRouter);
apiRouter.use("/creators", CreatorRouter);
apiRouter.use("/posts", PostRouter);
apiRouter.use("/import", ImportQueueRouter);

app.use("/api", apiRouter);
app.get("*name", (_, response) => {
	response.sendFile(
		path.join(__dirname, "../../frontend/dist/frontend/browser/index.html"),
	);
});

// Handling of unknown endpoints
app.use((_, __, next) => {
	next(createHttpError(404, "Endpoint not found."));
});

// Error handling
app.use(
	(error: unknown, _: Request, response: Response, next: NextFunction) => {
		const errorMessage = isHttpError(error)
			? error.message
			: "An unknown error occured.";
		const errorStatus = isHttpError(error) ? error.status : 500;

		if (errorStatus >= 500) {
			logger.error(`Status ${errorStatus}: ${errorMessage}`);
			console.error(error);
		}
		response.status(errorStatus).json({ error: errorMessage });
	},
);

export default app;
