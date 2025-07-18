import { Component, inject, type OnInit } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DomSanitizer } from "@angular/platform-browser";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { BackendService } from "./services/backend.service";
import { PostsService } from "./services/posts.service";
import { ProfileService } from "./services/profile.service";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatBadgeModule,
		RouterLink,
		MatDividerModule,
		MatProgressSpinnerModule,
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
	private readonly sanitizer = inject(DomSanitizer);
	private readonly registry = inject(MatIconRegistry);
	protected readonly authenticationService = inject(AuthenticationService);
	protected readonly profileService = inject(ProfileService);
	protected readonly backendService = inject(BackendService);
	protected readonly postsService = inject(PostsService);
	protected readonly router = inject(Router);

	protected readonly year = new Date().getFullYear();

	constructor() {
		this.initializeIcons();
	}

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

	private initializeIcons() {
		const icons = ["github"];
		for (const icon of icons) {
			console.log(`Registering icon: ${icon}`);
			this.registry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`icons/${icon}.svg`));
		}
	}

	public deleteAccount() {
		const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");

		if (!confirmed) {
			return;
		}

		const password = prompt("Please enter your password to confirm account deletion:");

		if (!password) {
			return;
		}

		this.backendService.authentication
			.remove({ password })
			.then(() => {
				this.authenticationService.removeToken();
				this.router.navigate(["/login"]);
			})
			.catch((error) => {
				console.error("Error deleting account:", error);
				alert(`Error deleting account: ${error.message}`);
			});
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
