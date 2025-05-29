import type { RequestHandler } from "express";
import { Schema } from "@bookmarks/shared";
import createHttpError from "http-errors";
import { database } from "../database";

export const addTag: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.tag.add.safeParse(request.body);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	const { title } = data;
	const existingTag = await database.tag.findFirst({
		where: {
			title,
			userId,
		},
	});

	if (existingTag) {
		throw createHttpError(409, "Tag with this title already exists.");
	}

	const tag = await database.tag.create({
		data: {
			title,
			userId,
		},
	});
	response.status(201).json(tag);
};

export const removeTag: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const tagId = request.params.tagId;
	if (!tagId) {
		throw createHttpError(400, "Tag ID is required.");
	}

	const tag = await database.tag.findUnique({
		where: { id: tagId, userId },
	});

	if (!tag) {
		throw createHttpError(404, "Tag not found.");
	}

	await database.tag.delete({
		where: { id: tagId, userId },
	});

	response.status(200).json(tag);
};

export const getTags: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { title } = Schema.tag.query.parse(request.query);

	const tags = await database.tag.findMany({
		where: {
			userId,
			title: {
				contains: title ?? "",
			},
		},
		orderBy: { title: "asc" },
	});
	response.status(200).json(tags);
};

export const editTag: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const tagId = request.params.tagId;
	if (!tagId) {
		throw createHttpError(400, "Tag ID is required.");
	}

	const { success, data, error } = Schema.tag.edit.safeParse(request.body);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	const { title } = data;

	const tag = await database.tag.findUnique({
		where: { id: tagId, userId },
	});

	if (!tag) {
		throw createHttpError(404, "Tag not found.");
	}

	const updatedTag = await database.tag.update({
		where: { id: tagId, userId },
		data: { title },
	});

	response.status(200).json(updatedTag);
};
