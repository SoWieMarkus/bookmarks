import { inject, Injectable, signal } from "@angular/core";
import type { Tag } from "../schemas/tag";
import { BackendService } from "./backend.service";
import { PostsService } from "./posts.service";

@Injectable({
	providedIn: "root",
})
export class TagsService {
	private readonly postService = inject(PostsService);
	private readonly backend = inject(BackendService);
	public readonly tags = signal<Tag[]>([]);

	public async add(title: string) {
		const tag = await this.backend.tags.add({ title });
		this.tags.update((currentTags) =>
			[...currentTags, tag].sort((a, b) => a.title.localeCompare(b.title)),
		);
		return tag;
	}

	public async remove(tagId: string) {
		const tag = await this.backend.tags.remove(tagId);
		this.tags.update((currentTags) =>
			currentTags.filter((t) => t.id !== tag.id),
		);

		// remove the tag from all the posts
		// we could also refresh the posts from the backend, but this is more time efficient
		this.postService.posts.update((currentPosts) =>
			currentPosts.map((post) => ({
				...post,
				tags: post.tags.filter((t) => t.id !== tag.id),
			})),
		);
	}

	public async edit(tagId: string, title: string) {
		const tag = await this.backend.tags.edit(tagId, { title });
		this.tags.update((currentTags) =>
			currentTags.map((t) => (t.id === tag.id ? tag : t)),
		);

		// replace the tag in all the posts
		// we could also refresh the posts from the backend, but this is more time efficient
		this.postService.posts.update((currentPosts) =>
			currentPosts.map((post) => ({
				...post,
				tags: post.tags.map((t) => (t.id === tag.id ? tag : t)),
			})),
		);
	}

	public async initialize() {
		const tags = await this.backend.tags.initialize();
		this.tags.set(tags);
	}

	public reset() {
		this.tags.set([]);
	}
}
