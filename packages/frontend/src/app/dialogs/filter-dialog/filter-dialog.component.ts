import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { z } from "zod";
import type { Creator, Tag } from "../../schemas";
import { CreatorsService, TagsService } from "../../services";

const FilterDialogDataSchema = z.object({
	tags: z.string().array(),
	creators: z.string().array(),
});

@Component({
	selector: "app-filter-dialog",
	imports: [MatDialogModule, MatChipsModule, MatButtonModule],
	templateUrl: "./filter-dialog.component.html",
	styleUrl: "./filter-dialog.component.scss",
})
export class FilterDialog {
	protected readonly tagsService = inject(TagsService);
	protected readonly creatorsService = inject(CreatorsService);
	protected readonly reference = inject(MatDialogRef<FilterDialog>);
	protected readonly data = inject<z.infer<typeof FilterDialogDataSchema>>(MAT_DIALOG_DATA);

	constructor() {
		// parse the data for type safety
		FilterDialogDataSchema.parse(this.data);
		this.data.tags = [...this.data.tags];
		this.data.creators = [...this.data.creators];
	}

	protected apply() {
		this.reference.close(this.data);
	}

	protected selectTag(tag: Tag) {
		this.data.tags = this.data.tags.includes(tag.id)
			? this.data.tags.filter((id) => id !== tag.id)
			: [...this.data.tags, tag.id];
	}

	protected selectCreator(creator: Creator) {
		this.data.creators = this.data.creators.includes(creator.id)
			? this.data.creators.filter((id) => id !== creator.id)
			: [...this.data.creators, creator.id];
	}

	protected isTagSelected(tag: Tag) {
		return this.data.tags.includes(tag.id);
	}

	protected isCreatorSelected(creator: Creator) {
		return this.data.creators.includes(creator.id);
	}

	protected reset() {
		this.data.tags = [];
		this.data.creators = [];
		this.reference.close(this.data);
	}
}
