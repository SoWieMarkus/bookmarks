import { Component, inject, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterLink } from "@angular/router";
import z from "zod";
import { ImportService } from "../../services/imports.service";

@Component({
	selector: "app-import-page",
	imports: [
		MatListModule,
		RouterLink,
		FormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: "./import-page.component.html",
	styleUrl: "./import-page.component.scss",
})
export class ImportPage {
	protected readonly snackbar = inject(MatSnackBar);
	protected readonly backlogItemsToAdd = model("");
	protected readonly importService = inject(ImportService);
	protected readonly isUpdating = signal(false);

	protected async addBacklogItems() {
		const backlogItems = this.backlogItemsToAdd();
		if (backlogItems.trim().length === 0) {
			return;
		}

		this.isUpdating.set(true);

		const items = backlogItems
			.split("\n")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
		if (items.length === 0) {
			return;
		}

		const UrlSchema = z.string().url();

		for (const item of items) {
			const { success } = UrlSchema.safeParse(item);
			if (success) continue;
			this.snackbar.open(`Invalid URL: ${item}`, "Close", { duration: 3000 });
			this.isUpdating.set(false);
			return;
		}

		await this.importService.add(items);
		this.isUpdating.set(false);
		this.backlogItemsToAdd.set("");
	}
}
