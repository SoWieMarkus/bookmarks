import { inject, Injectable, signal } from "@angular/core";
import { BackendService } from "./backend.service";
import type { ImportQueueItem } from "../schemas/import-queue";

@Injectable({
	providedIn: "root",
})
export class ImportService {
	private readonly backend = inject(BackendService);

	public readonly items = signal<ImportQueueItem[]>([]);

	public async add(urls: string[]) {
		const items = await this.backend.importQueue.add(urls);
		this.items.update((currentItems) => [...currentItems, ...items]);
	}

	public async remove(itemId: string) {
		const item = await this.backend.importQueue.remove(itemId);
		this.items.update((currentItems) =>
			currentItems.filter((a) => a.id !== item.id),
		);
	}

	public async initialize() {
		const items = await this.backend.importQueue.initialize();
		this.items.set(items);
	}

	public reset() {
		this.items.set([]);
	}

	public get(itemId: string): ImportQueueItem | null {
		return this.items().find((item) => item.id === itemId) ?? null;
	}

	public getNext() {
		return this.items()[0] ?? null;
	}

	public skip(id: string) {
		this.items.update((currentItems) => {
			const index = currentItems.findIndex((a) => a.id === id);
			if (index === -1) return currentItems;
			const item = currentItems[index];
			const newItems = [...currentItems];
			newItems.splice(index, 1);
			newItems.push(item);
			return newItems;
		});
	}
}
