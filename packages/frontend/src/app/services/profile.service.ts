import { Injectable, inject, signal } from "@angular/core";
import type { User } from "../schemas/authentication";
import { BackendService } from "./backend.service";

@Injectable({
	providedIn: "root",
})
export class ProfileService {
	private readonly backendService = inject(BackendService);

	public readonly user = signal<User | null>(null);

	public async initialize() {
		const user = await this.backendService.authentication.me();
		this.user.set(user);
	}

	public reset() {
		this.user.set(null);
	}
}
