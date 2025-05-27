import { Component, inject } from '@angular/core';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-watch-later-page',
  imports: [],
  templateUrl: './watch-later-page.component.html',
  styleUrl: './watch-later-page.component.scss'
})
export class WatchLaterPage {

  protected readonly postsService = inject(PostsService);



}
