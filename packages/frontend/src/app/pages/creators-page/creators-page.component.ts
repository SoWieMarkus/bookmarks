import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { CreateCreatorDialog } from "../../dialogs/create-creator-dialog/create-creator-dialog.component";
import type { Creator } from "../../schemas/creator";
import { CreatorsService } from "../../services/creators.service";

@Component({
	selector: "app-creator-page",
	imports: [MatButtonModule, MatIconModule, MatListModule, RouterLink],
	templateUrl: "./creators-page.component.html",
	styleUrl: "./creators-page.component.scss",
})
export class CreatorsPage {
	protected readonly creatorsService = inject(CreatorsService);
	protected readonly dialog = inject(MatDialog);

	public openAddCreatorDialog() {
		this.dialog.open(CreateCreatorDialog, {
			data: undefined,
			closeOnNavigation: true,
		});
	}

	public openEditCreatorDialog(creator: Creator) {
		this.dialog.open(CreateCreatorDialog, {
			data: creator,
			closeOnNavigation: true,
		});
	}

	protected remove(creator: Creator) {
		if (!confirm("Are you sure you want to delete this creator? This action cannot be undone.")) {
			return;
		}
		this.creatorsService.remove(creator.id);
	}
}
