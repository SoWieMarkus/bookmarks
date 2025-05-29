import type { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Schema } from "@bookmarks/shared";
import { database } from "../database";
import { getMetaTagsOfUrl } from "../utils/meta-tags";

export const addPost: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.post.add.safeParse(request.body);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	const existingPost = await database.post.findFirst({
		where: {
			url: data.url,
			userId,
		},
	});

	if (existingPost !== null) {
		throw createHttpError(409, "Post with this URL already exists.");
	}

	const { tags, creators, ...postData } = data;

	const tagIds = tags ?? [];
	const creatorIds = creators ?? [];
	const post = await database.post.create({
		data: {
			...postData,
			userId,
			tags: {
				connect: tagIds.map((tagId: string) => ({ id: tagId })),
			},
			creators: {
				connect: creatorIds.map((creatorId: string) => ({ id: creatorId })),
			},
		},
		include: { creators: { where: { userId } }, tags: { where: { userId } } },
	});

	response.status(201).json(post);
};

export const getPost: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const postId = request.params.postId;
	if (!postId) {
		throw createHttpError(400, "Post ID is required.");
	}

	const post = await database.post.findUnique({
		where: { id: postId, userId },
		include: {
			tags: { where: { userId } },
			creators: { where: { userId } },
		},
	});

	if (post === null) {
		throw createHttpError(404, "Post not found.");
	}

	response.status(200).json(post);
};

export const getPosts: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const posts = await database.post.findMany({
		where: {
			userId,
		},
		include: {
			tags: { where: { userId } },
			creators: { where: { userId } },
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	response.status(200).json(posts);
};

export const editPost: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const postId = request.params.postId;
	if (!postId) {
		throw createHttpError(400, "Post ID is required.");
	}

	const { success, data, error } = Schema.post.edit.safeParse(request.body);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	const existingPost = await database.post.findUnique({
		where: { id: postId, userId },
	});

	if (existingPost === null) {
		throw createHttpError(404, "Post not found.");
	}

	const { tags, creators, ...postData } = data;

	const tagIds = tags ?? [];
	const creatorIds = creators ?? [];

	const post = await database.post.update({
		where: { id: postId, userId },
		data: {
			...postData,
			tags: {
				set: tagIds.map((tagId: string) => ({ id: tagId })),
			},
			creators: {
				set: creatorIds.map((creatorId: string) => ({ id: creatorId })),
			},
		},
		include: { creators: { where: { userId } }, tags: { where: { userId } } },
	});

	response.status(200).json(post);
};

export const removePost: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const postId = request.params.postId;
	if (!postId) {
		throw createHttpError(400, "Post ID is required.");
	}

	const post = await database.post.delete({
		where: { id: postId, userId },
		include: { creators: { where: { userId } }, tags: { where: { userId } } },
	});

	response.status(200).json(post);
};

export const readLater: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const postId = request.params.postId;
	if (!postId) {
		throw createHttpError(400, "Post ID is required.");
	}

	const existingPost = await database.post.findUnique({
		where: { id: postId, userId },
	});
	if (existingPost === null) {
		throw createHttpError(404, "Post not found.");
	}

	const post = await database.post.update({
		where: { id: postId, userId },
		data: { readLater: !existingPost.readLater },
		include: { creators: { where: { userId } }, tags: { where: { userId } } },
	});

	response.status(200).json(post);
};

export const parseByUrl: RequestHandler = async (request, response) => {
	const userId = request.userId;
	if (userId === undefined) {
		throw createHttpError(401, "Unauthorized. Please provide a valid token.");
	}

	const { success, data, error } = Schema.post.parseByUrl.safeParse(
		request.body,
	);
	if (!success) {
		throw createHttpError(400, error.errors[0].message);
	}

	const { url } = data;

	const parsedPost = await getMetaTagsOfUrl(url);
	response.status(200).json(parsedPost);
};
