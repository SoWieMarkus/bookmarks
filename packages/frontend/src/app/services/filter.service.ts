import { Injectable, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class FilterService {
	public readonly creators = signal<string[]>([]);
	public readonly tags = signal<string[]>([]);
}
