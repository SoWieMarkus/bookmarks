import { inject, Injectable, signal } from "@angular/core";
import type { Creator } from "../schemas/creator";
import { BackendService } from "./backend.service";
import { PostsService } from "./posts.service";

@Injectable({
	providedIn: "root",
})
export class CreatorsService {
	private readonly backend = inject(BackendService);
	private readonly postsService = inject(PostsService);

	public readonly creators = signal<Creator[]>([]);

	public async add(name: string, image: string | null) {
		const creator = await this.backend.creators.add({ name, image });
		this.creators.update((currentCreators) =>
			[...currentCreators, creator].sort((a, b) =>
				a.name.localeCompare(b.name),
			),
		);
		return creator;
	}

	public async remove(creatorId: string) {
		const creator = await this.backend.creators.remove(creatorId);
		this.creators.update((currentCreators) =>
			currentCreators.filter((a) => a.id !== creator.id),
		);

		// remove the creator from all the posts
		// we could also refresh the posts from the backend, but this is more time efficient
		this.postsService.posts.update((currentPosts) =>
			currentPosts.map((post) => ({
				...post,
				creators: post.creators.filter((a) => a.id !== creator.id),
			})),
		);
	}

	public async edit(creatorId: string, name: string, image: string | null) {
		const creator = await this.backend.creators.edit(creatorId, {
			name,
			image,
		});
		this.creators.update((currentCreators) =>
			currentCreators.map((a) => (a.id === creator.id ? creator : a)),
		);

		// replace the creator in all the posts
		// we could also refresh the posts from the backend, but this is more time efficient
		this.postsService.posts.update((currentPosts) =>
			currentPosts.map((post) => ({
				...post,
				creators: post.creators.map((a) => (a.id === creator.id ? creator : a)),
			})),
		);
	}

	public async initialize() {
		const creators = await this.backend.creators.initialize();
		this.creators.set(creators);
	}

	public reset() {
		this.creators.set([]);
	}

	public image(creator: Creator): string {
		return creator.image ?? "default.png";
	}

	public get(creatorId: string): Creator | null {
		return this.creators().find((creator) => creator.id === creatorId) ?? null;
	}
}
