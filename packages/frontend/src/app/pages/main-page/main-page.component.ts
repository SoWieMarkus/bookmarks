import { Component, computed, inject, signal } from "@angular/core";
import { PostsService } from "../../services/posts.service";
import type { Post } from "../../schemas";
import { shuffleArray } from "@bookmarks/shared";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { FilterDialog } from "../../dialogs/filter-dialog/filter-dialog.component";
import { PostComponent } from "../../components/post/post.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterLink } from "@angular/router";

const applyTagFilter = (posts: Post[], filterTags: string[]) => {
	if (filterTags.length === 0) {
		return posts;
	}
	return posts.filter((post) =>
		filterTags.some((filterTag) =>
			post.tags.some((tag) => filterTag === tag.id),
		),
	);
};

const applyCreatorFilter = (posts: Post[], filterCreators: string[]) => {
	if (filterCreators.length === 0) {
		return posts;
	}
	return posts.filter((post) =>
		filterCreators.some((filterCreator) =>
			post.creators.some((creator) => filterCreator === creator.id),
		),
	);
};

@Component({
	selector: "app-main-page",
	imports: [
		RouterLink,
		MatIconModule,
		MatButtonModule,
		PostComponent,
		MatGridListModule,
	],
	templateUrl: "./main-page.component.html",
	styleUrl: "./main-page.component.scss",
})
export class MainPage {
	protected readonly dialog = inject(MatDialog);
	protected readonly postsService = inject(PostsService);

	private readonly filterCreators = signal<string[]>([]);
	private readonly filterTags = signal<string[]>([]);
	private readonly shuffle = signal(false);

	protected readonly posts = computed(() => {
		const shuffle = this.shuffle();
		let posts = [...this.postsService.posts()];

		const filterCreators = this.filterCreators();
		posts = applyCreatorFilter(posts, filterCreators);

		const filterTags = this.filterTags();
		posts = applyTagFilter(posts, filterTags);

		if (shuffle) {
			return shuffleArray(posts);
		}
		return posts;
	});

	protected openFilterDialog() {
		this.dialog
			.open(FilterDialog, {
				data: {
					tags: this.filterTags(),
					creators: this.filterCreators(),
				},
				closeOnNavigation: true,
			})
			.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.filterTags.set(result.tags);
					this.filterCreators.set(result.creators);
				}
			});
	}

	protected shuffleBookmarks() {
		this.shuffle.update((shuffle) => !shuffle);
	}
}
