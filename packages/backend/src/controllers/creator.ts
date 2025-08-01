import { Schema } from "@bookmarks/shared";
import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import * as z from "zod";
import { database } from "../database";
import { resizeImage } from "../utils";

export const addCreator: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.creator.add.safeParse(request.body);

	if (!success) {
		throw createHttpError(400, z.prettifyError(error));
	}

	const { name, image } = data;

	const updateImage = image === null ? undefined : await resizeImage(image);
	const creator = await database.creator.create({
		data: {
			name,
			userId,
			image: updateImage,
		},
	});

	response.status(201).json(creator);
};

export const removeCreator: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const creatorId = request.params.creatorId;
	if (!creatorId) {
		throw createHttpError(400, "Creator ID is required.");
	}

	const creator = await database.creator.findUnique({
		where: { id: creatorId, userId },
	});

	if (!creator) {
		throw createHttpError(404, "Creator not found.");
	}

	await database.creator.delete({
		where: { id: creatorId, userId },
	});

	response.status(200).json(creator);
};

export const getCreators: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { name } = Schema.creator.query.parse(request.query);

	const creators = await database.creator.findMany({
		where: {
			userId,
			name: { contains: name ?? "" },
		},
		orderBy: {
			name: "asc",
		},
	});

	response.status(200).json(creators);
};

export const editCreator: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const creatorId = request.params.creatorId;
	if (!creatorId) {
		throw createHttpError(400, "Creator ID is required.");
	}

	const { success, data, error } = Schema.creator.edit.safeParse(request.body);

	if (!success) {
		throw createHttpError(400, z.prettifyError(error));
	}

	const { name, image } = data;
	const updateImage = image === null ? undefined : await resizeImage(image);
	const creator = await database.creator.update({
		where: { id: creatorId, userId },
		data: { name, image: updateImage },
	});

	response.status(200).json(creator);
};
