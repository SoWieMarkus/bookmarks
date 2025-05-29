import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { shuffleArray } from "@bookmarks/shared";
import { PostComponent } from "../../components/post/post.component";
import { PostsService } from "../../services/posts.service";

@Component({
	selector: "app-watch-later-page",
	imports: [MatButtonModule, MatIconModule, PostComponent],
	templateUrl: "./watch-later-page.component.html",
	styleUrl: "./watch-later-page.component.scss",
})
export class WatchLaterPage {
	protected readonly postsService = inject(PostsService);

	protected readonly shuffle = signal(false);
	protected readonly posts = computed(() => {
		const posts = [...this.postsService.watchLater()];
		if (this.shuffle()) {
			return shuffleArray(posts);
		}
		return posts;
	});

	protected shuffleBookmarks() {
		this.shuffle.update((current) => !current);
	}
}
