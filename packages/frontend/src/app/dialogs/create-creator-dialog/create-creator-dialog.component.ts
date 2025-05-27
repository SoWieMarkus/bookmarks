import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-create-creator-dialog',
  imports: [MatDialogModule, FormsModule, ImageCropperComponent, MatIconModule, MatButtonModule],
  templateUrl: './create-creator-dialog.component.html',
  styleUrl: './create-creator-dialog.component.scss'
})
export class CreateCreatorDialog {

  protected readonly existingCreator = inject(MAT_DIALOG_DATA);
  protected readonly reference = inject(MatDialogRef<CreateCreatorDialog>)
  protected readonly titleText = computed(() => this.existingCreator === undefined ? "Add Creator" : "Edit Creator");
  protected readonly confirmActionText = computed(() => this.existingCreator === undefined ? "Add" : "Save");
  protected readonly creatorNameModel = model<string>(this.existingCreator === undefined ? "" : this.existingCreator.title);

  protected readonly onFileSelectedEvent = signal<Event | null>(null);

  protected onFileSelected(event: Event) {
    this.onFileSelectedEvent.set(event);
  }

}
