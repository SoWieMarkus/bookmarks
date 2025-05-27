import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TagsService } from "./tags.service";
import { CreatorsService } from "./creators.service";
import { PostsService } from "./posts.service";
import { ImportService } from "./imports.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private readonly router = inject(Router);

  private readonly tagsService = inject(TagsService);
  private readonly creatorService = inject(CreatorsService);
  private readonly postsService = inject(PostsService);
  private readonly importService = inject(ImportService); // Assuming you have an import queue service

  public readonly isFetchingData = signal(false);


  public getToken(): string | null {
    return localStorage.getItem("token");
  }

  public async setToken(token: string) {
    localStorage.setItem("token", token);
    await this.initialize();
  }

  public async initialize() {
    this.isFetchingData.set(true);
    await this.tagsService.initialize();
    await this.creatorService.initialize();
    await this.postsService.initialize();
    await this.importService.initialize();
    this.isFetchingData.set(false);
  }

  public removeToken(): void {
    localStorage.removeItem("token");
    this.tagsService.reset();
    this.creatorService.reset();
    this.postsService.reset();
    this.importService.reset();
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
