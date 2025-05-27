import { Component, inject } from '@angular/core';
import { CreatorsService } from '../../services/creators.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateCreatorDialog } from '../../dialogs/create-creator-dialog/create-creator-dialog.component';
import type { Creator } from '../../models/creator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-creator-page',
  imports: [MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './creators-page.component.html',
  styleUrl: './creators-page.component.scss'
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


}
