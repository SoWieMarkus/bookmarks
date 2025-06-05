import { Component, computed, inject, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type ImageCroppedEvent, ImageCropperComponent } from "ngx-image-cropper";
import { z } from "zod";
import { type Creator, CreatorSchema } from "../../schemas";
import { CreatorsService } from "../../services";
@Component({
	selector: "app-create-creator-dialog",
	imports: [
		MatProgressSpinnerModule,
		MatFormFieldModule,
		MatMenuModule,
		MatDialogModule,
		FormsModule,
		ImageCropperComponent,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
	],
	templateUrl: "./create-creator-dialog.component.html",
	styleUrl: "./create-creator-dialog.component.scss",
})
export class CreateCreatorDialog {
	private readonly snackbar = inject(MatSnackBar);
	private readonly creatorsService = inject(CreatorsService);

	protected readonly existingCreator = inject<Creator | undefined>(MAT_DIALOG_DATA);
	protected readonly reference = inject(MatDialogRef<CreateCreatorDialog>);
	protected readonly titleText = computed(() => (this.existingCreator === undefined ? "Add Creator" : "Edit Creator"));
	protected readonly confirmActionText = computed(() => (this.existingCreator === undefined ? "Add" : "Save"));

	protected readonly attributeName = model<string>(this.existingCreator === undefined ? "" : this.existingCreator.name);
	protected readonly attributeImage = signal<string | null>(
		this.existingCreator === undefined ? null : this.existingCreator.image,
	);

	// tells if we are currently uploading the changes to/the new creator
	protected readonly isUploading = signal(false);

	protected readonly draftImageUrl = signal<string | undefined>(undefined);

	protected readonly onFileSelectedEvent = signal<Event | null>(null);
	protected readonly image = computed(() => {
		return this.existingCreator === undefined ? "default.png" : this.creatorsService.image(this.existingCreator);
	});

	constructor() {
		// Parse the existing tag data for type safety
		CreatorSchema.optional().parse(this.existingCreator);
	}

	protected onFileSelected(event: Event) {
		this.onFileSelectedEvent.set(event);
	}

	protected async confirm() {
		const name = this.attributeName();
		const image = this.attributeImage();

		try {
			this.reference.disableClose = true;
			if (this.existingCreator === undefined) {
				await this.creatorsService.add(name, image);
				this.reference.close();
				return;
			}

			if (this.existingCreator.name === name && this.existingCreator.image === image) {
				this.reference.close();
				return;
			}

			await this.creatorsService.edit(this.existingCreator.id, name, image);
			this.reference.close();
		} catch (error) {
			if (error instanceof Error) {
				this.snackbar.open(`Error adding creator: ${error?.message}`, "Close", {
					duration: 3000,
				});
				console.error("Error adding creator:", error);
				return;
			}

			console.error("Error adding creator:", error);
			this.snackbar.open("An unexpected error happend", "Close", {
				duration: 3000,
			});
		} finally {
			this.reference.disableClose = false;
			this.isUploading.set(false);
		}
	}

	protected loadPictureFromUrl() {
		const url = prompt("Enter the URL of the image:");
		if (!url) return;
		const { success, data, error } = z.string().url().safeParse(url);
		if (!success) {
			this.snackbar.open(`Invalid URL: ${error.message}`, "Close", {
				duration: 3000,
			});
			return;
		}

		this.draftImageUrl.set(data);
	}

	protected imageCropped(event: ImageCroppedEvent) {
		if (!event.objectUrl) return;

		const blob = event.blob;
		if (blob === null || blob === undefined) return;

		const reader = new FileReader();
		reader.readAsDataURL(blob);

		reader.onloadend = () => {
			const base64Image = reader.result as string;
			this.attributeImage.set(base64Image);
		};
	}

	protected loadImageFailed() {
		this.snackbar.open("Failed to load image", "Close", {
			duration: 3000,
		});
		this.draftImageUrl.set(undefined);
		this.onFileSelectedEvent.set(null);
	}
}
