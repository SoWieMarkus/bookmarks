import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { type Creator, CreatorSchema } from '../../schemas';
import { CreatorsService } from '../../services';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-create-creator-dialog',
  imports: [MatFormFieldModule, MatMenuModule, MatDialogModule, FormsModule, ImageCropperComponent, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './create-creator-dialog.component.html',
  styleUrl: './create-creator-dialog.component.scss'
})
export class CreateCreatorDialog {

  private readonly creatorsService = inject(CreatorsService);

  protected readonly existingCreator = inject<Creator | undefined>(MAT_DIALOG_DATA);
  protected readonly reference = inject(MatDialogRef<CreateCreatorDialog>)
  protected readonly titleText = computed(() => this.existingCreator === undefined ? "Add Creator" : "Edit Creator");
  protected readonly confirmActionText = computed(() => this.existingCreator === undefined ? "Add" : "Save");
  protected readonly attributeName = model<string>(this.existingCreator === undefined ? "" : this.existingCreator.name);
  protected readonly attributeImage = signal<string | null>(null);

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

}
