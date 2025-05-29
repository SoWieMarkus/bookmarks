import jwt from "jsonwebtoken";
import { env } from ".";
export const createToken = (userId: string) => jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "31d" });
