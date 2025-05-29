import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Schema } from "@bookmarks/shared";
import type { Observable } from "rxjs";
import type { z } from "zod";
import { environment } from "../../environments/environment";
import { AuthenticationSchema, UserSchema } from "../schemas/authentication";
import { CreatorSchema } from "../schemas/creator";
import { ImportQueueItemSchema } from "../schemas/import-queue";
import { PostSchema, PostTemplateSchema } from "../schemas/post";
import { TagSchema } from "../schemas/tag";

const BACKEND_URL = environment.backend;

@Injectable({
	providedIn: "root",
})
export class BackendService {
	private readonly http = inject(HttpClient);

	private handleResponse<T>(
		observable: Observable<T>,
		responseModel?: z.Schema<T>,
	): Promise<T> {
		return new Promise((resolve, reject) => {
			observable.subscribe({
				next: (response) => {
					if (!responseModel) {
						resolve(response);
						return;
					}
					const { success, data, error } = responseModel.safeParse(response);
					if (!success) {
						reject(new Error(error.message));
						return;
					}
					resolve(data);
				},
				error: (error) => {
					console.error("Error in backend service:", error);
					reject(
						new Error(
							error.error?.error ??
								"An error occurred while processing the request.",
						),
					);
				},
			});
		});
	}

	private get<T>(url: string, responseModel?: z.Schema<T>): Promise<T> {
		return this.handleResponse(
			this.http.get<T>(`${BACKEND_URL}/${url}`),
			responseModel,
		);
	}

	private post<T>(
		url: string,
		body: unknown,
		responseModel?: z.Schema<T>,
	): Promise<T> {
		return this.handleResponse(
			this.http.post<T>(`${BACKEND_URL}/${url}`, body),
			responseModel,
		);
	}

	private delete<T>(url: string, responseModel?: z.Schema<T>): Promise<T> {
		return this.handleResponse(
			this.http.delete<T>(`${BACKEND_URL}/${url}`),
			responseModel,
		);
	}

	public get tags() {
		return {
			add: (tag: z.infer<typeof Schema.tag.add>) =>
				this.post("tags/add", tag, TagSchema),
			edit: (tagId: string, tag: z.infer<typeof Schema.tag.edit>) =>
				this.post(`tags/edit/${tagId}`, tag, TagSchema),
			remove: (tagId: string) => this.delete(`tags/remove/${tagId}`, TagSchema),
			initialize: () => this.get("tags", TagSchema.array()),
		};
	}

	public get creators() {
		return {
			add: (creator: z.infer<typeof Schema.creator.add>) =>
				this.post("creators/add", creator, CreatorSchema),
			edit: (creatorId: string, creator: z.infer<typeof Schema.creator.edit>) =>
				this.post(`creators/edit/${creatorId}`, creator, CreatorSchema),
			remove: (creatorId: string) =>
				this.delete(`creators/remove/${creatorId}`, CreatorSchema),
			initialize: () => this.get("creators", CreatorSchema.array()),
		};
	}

	public get posts() {
		return {
			add: (post: z.infer<typeof Schema.post.add>) =>
				this.post("posts/add", post, PostSchema),
			edit: (postId: string, post: z.infer<typeof Schema.post.edit>) =>
				this.post(`posts/edit/${postId}`, post, PostSchema),
			remove: (postId: string) =>
				this.delete(`posts/remove/${postId}`, PostSchema),
			initialize: () => this.get("posts", PostSchema.array()),
			url: (url: z.infer<typeof Schema.post.parseByUrl>) =>
				this.post("posts/url", url, PostTemplateSchema),
			queue: (postId: string) =>
				this.post(`posts/queue/${postId}`, {}, PostSchema),
		};
	}

	public get authentication() {
		return {
			login: (credentials: z.infer<typeof Schema.authentication.login>) =>
				this.post("authentication/login", credentials, AuthenticationSchema),
			register: (credentials: z.infer<typeof Schema.authentication.register>) =>
				this.post("authentication/register", credentials, AuthenticationSchema),
			remove: () => this.delete("authentication/remove"),
			me: () => this.get("authentication/me", UserSchema),
		};
	}

	public get importQueue() {
		return {
			add: (importQueue: z.infer<typeof Schema.importQueue.addMultiple>) =>
				this.post("import/add", importQueue, ImportQueueItemSchema.array()),
			remove: (importQueueId: string) =>
				this.delete(`import/remove/${importQueueId}`, ImportQueueItemSchema),
			initialize: () => this.get("import", ImportQueueItemSchema.array()),
		};
	}
}
