import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatorsService, PostsService } from '../../services';
import type { Creator } from '../../schemas';
import { PostComponent } from '../../components/post/post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateCreatorDialog } from '../../dialogs/create-creator-dialog/create-creator-dialog.component';

@Component({
  selector: 'app-creator-details-page',
  imports: [PostComponent, MatIconModule],
  templateUrl: './creator-details-page.component.html',
  styleUrl: './creator-details-page.component.scss'
})
export class CreatorDetailsPage implements OnInit {

  protected readonly creatorService = inject(CreatorsService);
  protected readonly postsService = inject(PostsService);

  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly creator = signal<Creator | null>(null);
  protected readonly posts = computed(() => {
    const creator = this.creator();
    return creator === null ? [] : this.postsService.getByCreator(creator.id);
  });
  protected readonly creatorName = computed(() => {
    const creator = this.creator();
    return creator === null ? "" : creator.name
  });
  protected readonly thumbnail = computed(() => {
    const creator = this.creator();
    return creator === null ? "default.png" : this.creatorService.image(creator);
  });

  public ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {

        // biome-ignore lint/complexity/useLiteralKeys: Doesn't work here
        const creatorId = params["creatorId"];
        if (!creatorId) {
          this.router.navigate(['/']);
          return;
        }

        const creator = this.creatorService.get(creatorId);
        if (!creator) {
          this.router.navigate(['/']);
          return;
        }
        this.creator.set(creator);


      },
      error: (error) => {
        console.error('Error fetching route parameters:', error);
        this.router.navigate(['/']);
      }
    });
  }

  protected openCreateCreatorDialog(): void {
    this.dialog.open(CreateCreatorDialog, {
      data: this.creator(),
      closeOnNavigation: true,
    });
  }
}
