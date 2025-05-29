import { Component, inject } from "@angular/core";
import { TagsService } from "../../services/tags.service";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { CreateTagDialog } from "../../dialogs/create-tag-dialog/create-tag-dialog.component";
import type { Tag } from "../../schemas";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
	selector: "app-tags-page",
	imports: [MatListModule, MatButtonModule, MatIconModule],
	templateUrl: "./tags-page.component.html",
	styleUrl: "./tags-page.component.scss",
})
export class TagsPage {
	protected readonly tagsService = inject(TagsService);
	protected readonly dialog = inject(MatDialog);
	private readonly snackbar = inject(MatSnackBar);

	public openAddTagDialog() {
		this.dialog.open(CreateTagDialog, {
			data: undefined,
			closeOnNavigation: true,
		});
	}

	public openEditTagDialog(tag: Tag) {
		this.dialog.open(CreateTagDialog, {
			data: tag,
			closeOnNavigation: true,
		});
	}

	public removeTag(tag: Tag) {
		if (
			confirm(
				`Are you sure you want to remove the tag "${tag.title}"? This action cannot be undone.`,
			)
		) {
			this.tagsService.remove(tag.id).catch((error) => {
				console.error("Error removing tag:", error);
				this.snackbar.open(`Error removing tag: ${error.message}`, "Close", {});
			});
		}
	}
}
