import { Schema } from "@bookmarks/shared";
import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as z from "zod";
import { database } from "../database";
import { createToken } from "../utils";

export const register: RequestHandler = async (request, response) => {
	const { success, data, error } = Schema.authentication.register.safeParse(request.body);

	if (!success) {
		throw createHttpError(400, z.prettifyError(error));
	}

	const { username, password } = data;

	const existingUser = await database.user.findUnique({
		where: { username },
	});

	if (existingUser !== null) {
		throw createHttpError(409, "Username already exists.");
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await database.user.create({
		data: {
			username,
			passwordHash: hashedPassword,
		},
	});
	const token = createToken(user.id);
	response.status(201).json({
		token,
	});
};

export const login: RequestHandler = async (request, response) => {
	const { success, data, error } = Schema.authentication.login.safeParse(request.body);

	if (!success) {
		throw createHttpError(400, z.prettifyError(error));
	}

	const { username, password } = data;

	const user = await database.user.findUnique({
		where: { username },
	});

	if (user === null) {
		throw createHttpError(401, "Invalid username or password.");
	}

	const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
	if (!isPasswordValid) {
		throw createHttpError(401, "Invalid username or password.");
	}

	const token = createToken(user.id);
	response.status(200).json({ token });
};

export const me: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const user = await database.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			createdAt: true,
		},
	});

	if (user === null) {
		throw createHttpError(404, "User not found.");
	}

	response.status(200).json(user);
};

export const remove: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.authentication.remove.safeParse(request.body);
	if (!success) {
		throw createHttpError(400, z.prettifyError(error));
	}

	const { password } = data;
	const userWithPassword = await database.user.findUnique({
		where: { id: userId },
	});

	if (
		userWithPassword?.passwordHash === null ||
		userWithPassword === null ||
		(await bcrypt.compare(password, userWithPassword?.passwordHash))
	) {
		throw createHttpError(400, "Bad Request.");
	}

	await database.user.delete({
		where: { id: userId },
	});

	response.status(204).send();
};
