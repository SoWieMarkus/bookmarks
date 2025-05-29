import { Component, computed, inject, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type Tag, TagSchema } from "../../schemas";
import { TagsService } from "../../services/tags.service";

@Component({
	selector: "app-create-tag-dialog",
	imports: [
		FormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinnerModule,
	],
	templateUrl: "./create-tag-dialog.component.html",
	styleUrl: "./create-tag-dialog.component.scss",
})
export class CreateTagDialog {
	protected readonly existingTag = inject<Tag | undefined>(MAT_DIALOG_DATA);
	protected readonly snackbar = inject(MatSnackBar);
	protected readonly tagsService = inject(TagsService);
	protected readonly reference = inject(MatDialogRef<CreateTagDialog>);

	protected readonly titleText = computed(() => (this.existingTag === undefined ? "Add Tag" : "Edit Tag"));
	protected readonly confirmActionText = computed(() => (this.existingTag === undefined ? "Add" : "Save"));

	protected readonly attributeTitle = model<string>(this.existingTag === undefined ? "" : this.existingTag.title);
	protected readonly isUploading = signal(false);

	constructor() {
		// Parse the existing tag data for type safety
		TagSchema.optional().parse(this.existingTag);
	}

	public async confirm() {
		const title = this.attributeTitle();

		try {
			this.reference.disableClose = true;
			if (this.existingTag === undefined) {
				await this.tagsService.add(title);
				this.reference.close();
				return;
			}

			if (this.existingTag.title === title) {
				this.reference.close();
				return;
			}

			await this.tagsService.edit(this.existingTag.id, title);
			this.reference.close();
		} catch (error) {
			if (error instanceof Error) {
				this.snackbar.open(`Error adding tag: ${error?.message}`, "Close", {
					duration: 3000,
				});
				console.error("Error adding tag:", error);
				return;
			}

			console.error("Error adding tag:", error);
			this.snackbar.open("An unexpected error happend", "Close", {
				duration: 3000,
			});
		} finally {
			this.reference.disableClose = false;
			this.isUploading.set(false);
		}
	}
}
