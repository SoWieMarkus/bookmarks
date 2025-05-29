import { Injectable, computed, inject, signal } from "@angular/core";
import type { Schema } from "@bookmarks/shared";
import type { z } from "zod";
import type { Post, PostTemplate } from "../schemas/post";
import { BackendService } from "./backend.service";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private readonly backend = inject(BackendService);
	public readonly posts = signal<Post[]>([]);

	public readonly watchLater = computed(() => {
		return this.posts().filter((post) => post.readLater);
	});

	public async initialize() {
		const posts = await this.backend.posts.initialize();
		this.posts.set(posts);
	}

	public async add(post: z.infer<typeof Schema.post.add>) {
		const newPost = await this.backend.posts.add(post);
		this.posts.update((currentPosts) => [newPost, ...currentPosts]);
	}

	public async edit(postId: string, post: z.infer<typeof Schema.post.edit>) {
		const updatedPost = await this.backend.posts.edit(postId, post);
		this.posts.update((currentPosts) => currentPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
	}

	public async remove(postId: string) {
		const removedPost = await this.backend.posts.remove(postId);
		this.posts.update((currentPosts) => currentPosts.filter((p) => p.id !== removedPost.id));
	}

	public get(postId: string): Post | null {
		return this.posts().find((post) => post.id === postId) ?? null;
	}

	public reset() {
		this.posts.set([]);
	}

	public async url(url: string): Promise<PostTemplate> {
		return await this.backend.posts.url({ url });
	}

	public async queue(postId: string) {
		const post = this.get(postId);
		if (!post) {
			throw new Error(`Post with ID ${postId} not found`);
		}
		const updatedPost = await this.backend.posts.queue(postId);
		this.posts.update((currentPosts) => currentPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
	}

	public getByCreator(creatorId: string): Post[] {
		return this.posts().filter((post) => post.creators.some((creator) => creator.id === creatorId));
	}
}
