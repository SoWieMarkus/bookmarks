import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CreatorsService } from "./creators.service";
import { ImportService } from "./imports.service";
import { PostsService } from "./posts.service";
import { ProfileService } from "./profile.service";
import { TagsService } from "./tags.service";

@Injectable({
	providedIn: "root",
})
export class AuthenticationService {
	private readonly router = inject(Router);

	private readonly tagsService = inject(TagsService);
	private readonly creatorService = inject(CreatorsService);
	private readonly postsService = inject(PostsService);
	private readonly importService = inject(ImportService);
	private readonly profileService = inject(ProfileService);

	public readonly isFetchingData = signal(false);
	public readonly username = signal<string | null>(null);

	public getToken(): string | null {
		return localStorage.getItem("token");
	}

	public async setToken(token: string) {
		localStorage.setItem("token", token);
		await this.initialize();
	}

	public async initialize() {
		this.isFetchingData.set(true);

		try {
			await Promise.all([
				this.profileService.initialize(),
				this.tagsService.initialize(),
				this.creatorService.initialize(),
				this.postsService.initialize(),
				this.importService.initialize(),
			]);
		} catch (error) {
			console.error("Error during initialization:", error);
			this.removeToken();
			this.router.navigate(["/login"]);
		}

		this.isFetchingData.set(false);
	}

	public removeToken(): void {
		localStorage.removeItem("token");
		this.tagsService.reset();
		this.creatorService.reset();
		this.postsService.reset();
		this.importService.reset();
		this.profileService.reset();
	}

	public isTokenExpired(): boolean {
		const token = this.getToken();
		if (!token) {
			return true;
		}

		const expiry = this.getTokenExpiry(token);
		return expiry ? expiry < Date.now() / 1000 : false;
	}

	private getTokenExpiry(token: string): number | null {
		try {
			const decodedToken = JSON.parse(atob(token.split(".")[1]));
			return decodedToken.exp ?? null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
