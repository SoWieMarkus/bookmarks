import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
	DATABASE_URL: str(),
	PORT: port(),
	JWT_SECRET: str(),
});
