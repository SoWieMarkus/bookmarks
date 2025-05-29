import { Component, inject, type OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from './services/authentication.service';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { PostsService } from './services/posts.service';
import { MatDividerModule } from '@angular/material/divider';
import { BackendService } from './services/backend.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, RouterLink, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly authenticationService = inject(AuthenticationService);
  protected readonly profileService = inject(ProfileService);
  protected readonly backendService = inject(BackendService);
  protected readonly postsService = inject(PostsService);
  protected readonly router = inject(Router);

  protected readonly year = new Date().getFullYear();

  protected logout(): void {
    this.authenticationService.removeToken();
    this.router.navigate(["/login"]);
  }

  public ngOnInit(): void {
    if (this.authenticationService.isTokenExpired()) {
      this.authenticationService.removeToken();
      return;
    }
    this.authenticationService.initialize();
  }

  public deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.backendService.authentication.remove().then(() => {
        this.authenticationService.removeToken();
        this.router.navigate(["/login"]);
      }).catch((error) => {
        console.error("Error deleting account:", error);
        alert(`Error deleting account: ${error.message}`);
      });
    }
  }

  protected export() {
    const urls = this.postsService.posts().map((post) => post.url);
    const blob = new Blob([urls.join("\n")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
