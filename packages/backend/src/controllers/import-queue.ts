import { Schema } from "@bookmarks/shared";
import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import { database } from "../database";

export const addLinksToImportQueue: RequestHandler = async (
	request,
	response,
) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.importQueue.addMultiple.safeParse(
		request.body,
	);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	await database.importQueueItem.deleteMany({
		where: { userId, url: { in: data } },
	});

	await database.importQueueItem.createMany({
		data: data.map((url) => ({ url, userId })),
	});

	const items = await database.importQueueItem.findMany({
		where: {
			userId,
			url: { in: data },
		},
	});

	response.status(201).json(items);
};

export const getImportQueue: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const items = await database.importQueueItem.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});

	response.status(200).json(items);
};

export const removeImportQueueItem: RequestHandler = async (
	request,
	response,
) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const itemId = request.params.itemId;
	if (!itemId) {
		throw createHttpError(400, "Item ID is required.");
	}

	const item = await database.importQueueItem.delete({
		where: { id: itemId, userId },
	});

	response.status(200).json(item);
};
