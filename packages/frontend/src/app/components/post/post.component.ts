import { Component, computed, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { DurationPipe } from "../../pipes/duration.pipe";
import { ShortenPipe } from "../../pipes/shorten.pipe";
import type { Creator } from "../../schemas";
import type { Post } from "../../schemas/post";
import { CreatorsService } from "../../services";
import { PostsService } from "../../services/posts.service";

@Component({
	selector: "app-post",
	imports: [ShortenPipe, MatChipsModule, RouterLink, DurationPipe, MatIconModule, MatButtonModule],
	templateUrl: "./post.component.html",
	styleUrl: "./post.component.scss",
})
export class PostComponent {
	public readonly post = input.required<Post>();

	protected readonly postService = inject(PostsService);
	protected readonly creatorService = inject(CreatorsService);

	protected creatorLink(creator: Creator) {
		return `/creator/${creator.id}`;
	}

	protected readonly favoriteIcon = computed(() => {
		return this.post().readLater ? "bookmark" : "bookmark_border";
	});

	protected queue() {
		this.postService.queue(this.post().id);
	}

	protected remove() {
		if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
			return;
		}
		this.postService.remove(this.post().id);
	}

	protected openUrl() {
		const url = this.post().url;
		if (url === null) return;
		window.open(url, "_blank");
	}
}
