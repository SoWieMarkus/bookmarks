import { Component, computed, inject, model, type OnInit, signal } from '@angular/core';
import { ActivatedRoute, type Params, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { ImportService } from '../../services/imports.service';
import { z } from 'zod';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Tag, Creator } from '../../schemas';
import { MatDialog } from '@angular/material/dialog';
import { CreateTagDialog } from '../../dialogs/create-tag-dialog/create-tag-dialog.component';
import { CreateCreatorDialog } from '../../dialogs/create-creator-dialog/create-creator-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DurationPipe } from '../../pipes/duration.pipe';
import { type MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, type MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CreatorsService, TagsService } from '../../services';
import { COMMA, ENTER } from "@angular/cdk/keycodes";


@Component({
  selector: 'app-create-post-page',
  imports: [MatAutocompleteModule, MatChipsModule, DurationPipe, RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, FormsModule, MatDividerModule, MatInputModule, MatCheckboxModule, MatProgressSpinnerModule],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.scss'
})
export class CreatePostPage implements OnInit {

  protected readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  protected readonly creatorsService = inject(CreatorsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly postsService = inject(PostsService);
  private readonly tagsService = inject(TagsService);
  private readonly importService = inject(ImportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly attributeTitle = model("");
  protected readonly attributeDescription = model("");
  protected readonly attributeReadLater = model(false);
  protected readonly attributeUrl = model("");
  protected readonly attributeDuration = model(0);
  protected readonly attributeTags = model<Tag[]>([]);
  protected readonly attributeCreators = model<Creator[]>([]);
  protected readonly thumbnailUrl = signal<string | null>(null);

  // logic for filtering creators based on user input
  protected readonly currentCreator = model("");
  protected readonly filteredCreators = computed(() => {
    const currentCreator = this.currentCreator().toLowerCase();
    return currentCreator
      ? this.creatorsService.creators().filter(creator => creator.name.toLowerCase().includes(currentCreator))
      : this.creatorsService.creators();
  });

  // logic for filtering tags based on user input
  protected readonly currentTag = model("");
  protected readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.tagsService.tags().filter(tag => tag.title.toLowerCase().includes(currentTag))
      : this.tagsService.tags();
  });


  protected readonly mode = model<"create" | "edit" | "import">("create");

  // this can be the id of a post that is being edited or the id of an import item that is being imported
  // it depends on the mode which one it is
  protected readonly id = model<string | null>(null);

  // flag used to indicate if we currently waiting for the item that is edited or imported to be prepared
  protected readonly preparing = model(true);

  // flag used to indicate if we currently wait for a response from the parse url endpoint
  protected readonly loadingUrl = model(false);
  protected readonly pageTitleText = computed(() => {
    switch (this.mode()) {
      case "create":
        return "Create New Post";
      case "edit":
        return "Edit Post";
      case "import":
        return "Import Post";
      default:
        return "Create Post";
    }
  });

  public ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.initialize(params).catch(error => {
          // check if there was an error during initialization and just set the mode to create in that case
          this.clear();
          this.preparing.set(false);
          console.error("Error initializing create post page:", error);
          this.snackbar.open("An error occurred while initializing the page. Please try again.", "Close", {
            duration: 5000,
          });
          this.mode.set("create");
        });
      },
      error: (error) => {
        console.error("Error reading route parameters:", error);
        this.preparing.set(false);
      }
    });
  }

  private async initialize(params: Params) {
    this.preparing.set(true);
    this.clear();

    // biome-ignore lint/complexity/useLiteralKeys: Doesn't work here
    const postId = params["postId"];
    // biome-ignore lint/complexity/useLiteralKeys: Doesn't work here
    const importId = params["importId"];

    if (postId !== undefined && this.loadExistingPost(postId)) {
      this.mode.set("edit");
      this.id.set(postId);
      this.preparing.set(false);
      return;
    }

    if (importId !== undefined && await this.loadImportQueueItem(importId)) {
      this.mode.set("import");
      this.id.set(importId);
      this.preparing.set(false);
      return;
    }

    if (await this.loadFromClipboard()) {
      this.mode.set("create");
      this.preparing.set(false);
      return;
    }

    this.preparing.set(false);
  }

  private loadExistingPost(postId: string) {
    const post = this.postsService.get(postId);
    if (post === null) return false;
    this.attributeTitle.set(post.title);
    this.attributeDescription.set(post.description ?? "");
    this.attributeReadLater.set(post.readLater ?? false);
    this.attributeUrl.set(post.url);
    this.attributeDuration.set(post.duration ?? 0);
    this.thumbnailUrl.set(post.thumbnail);
    this.attributeCreators.set(post.creators);
    this.attributeTags.set(post.tags);
    return true;
  }

  private async loadImportQueueItem(importId: string) {
    const importQueueItem = this.importService.get(importId);
    if (importQueueItem === null) return false;
    await this.loadFromUrl(importQueueItem.url);
    return true;
  }

  private async loadFromClipboard() {
    if (!navigator.clipboard) {
      return false;
    }

    const clipboard = await navigator.clipboard.readText();
    const { success, data } = z.string().url().safeParse(clipboard);
    if (!success) {
      return false;
    }
    await this.loadFromUrl(data);
    return true;
  }

  protected async loadFromUrl(url: string) {
    // clear will reset the ID, so we need to cache it here
    const id = this.id();
    this.clear();
    this.id.set(id);
    this.attributeUrl.set(url);

    this.loadingUrl.set(true);
    try {
      const template = await this.postsService.url(url);
      this.attributeTitle.set(template.title);
      this.attributeDescription.set(template.description ?? "");
      this.attributeReadLater.set(false);
      this.attributeUrl.set(template.url);
      if (typeof template.duration !== "string") {
        this.attributeDuration.set(template.duration ?? 0);
      } else {
        console.warn("Duration is a string, expected a number.", template.duration);
      }
      this.thumbnailUrl.set(template.thumbnail);

    } catch (error) {
      console.error("Error loading URL:", error);
      this.snackbar.open("An error occurred while loading the URL. Please check the URL and try again.", "Close", {
        duration: 5000,
      });
    }
    this.loadingUrl.set(false);

  }

  protected async commit() {
    const data = {
      title: this.attributeTitle(),
      description: this.attributeDescription() || null,
      readLater: this.attributeReadLater(),
      url: this.attributeUrl(),
      duration: this.attributeDuration() || null,
      tags: this.attributeTags().map(tag => tag.id),
      creators: this.attributeCreators().map(creator => creator.id),
      thumbnail: this.thumbnailUrl(),
    }

    const mode = this.mode();

    try {
      if (mode === "create") {
        await this.postsService.add(data);
        this.router.navigate(['/']);
        return;
      }

      const id = this.id();
      if (id === null) {
        throw new Error("An unexpected error occurred: Post ID is null.");
      }

      if (mode === "edit") {
        await this.postsService.edit(id, data);
        this.router.navigate(['/']);
        return;
      }

      if (mode === "import") {
        await this.postsService.add(data);
        await this.importService.remove(id);

        const next = this.importService.getNext();
        if (next === null) {
          this.snackbar.open("Import completed successfully.", "Close", {
            duration: 5000,
          });
          this.router.navigate(['/']);
          return;
        }
        this.router.navigate(['/create'], {
          queryParams: { importId: next.id },
        });

        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error committing post:", error.message);
        this.snackbar.open(error.message, "Close", {
          duration: 5000,
        });
      }
    }
  }

  protected openCreateTagDialog() {
    this.dialog.open(CreateTagDialog, {
      data: undefined,
      closeOnNavigation: true,
    });
  }

  protected openCreateCreatorDialog() {
    this.dialog.open(CreateCreatorDialog, {
      data: undefined,
      closeOnNavigation: true,
    });
  }

  protected removeImportItem() {
    const id = this.id();
    if (id === null) {
      console.error("Error removing import item: Import ID is null.");
      return;
    }

    if (confirm("Are you sure you want to remove this import item? This action cannot be undone.")) {
      this.importService.remove(id);
      const next = this.importService.getNext();
      if (next === null) {
        return;
      }
      this.router.navigate(['/create'], {
        queryParams: { importId: next.id },
      });
    }
  }

  protected skipImportItem() {
    const id = this.id();
    if (id === null) {
      return;
    }

    this.importService.skip(id);
    const next = this.importService.getNext();
    if (next === null) {
      return;
    }
    this.router.navigate(['/create'], {
      queryParams: { importId: next.id },
    });
  }

  protected clear() {
    this.attributeTitle.set("");
    this.attributeDescription.set("");
    this.attributeReadLater.set(false);
    this.attributeUrl.set("");
    this.attributeDuration.set(0);
    this.attributeTags.set([]);
    this.attributeCreators.set([]);
    this.thumbnailUrl.set(null);
    this.id.set(null);
  }


  protected removeCreator(creator: Creator) {
    this.attributeCreators.set(this.attributeCreators().filter(c => c.id !== creator.id));
  }

  protected selectCreator(event: MatAutocompleteSelectedEvent) {
    if (this.attributeCreators().some(creator => creator.id === event.option.value.id)) {
      this.currentCreator.set("");
      return;
    }
    this.attributeCreators.update((creators) => [...creators, event.option.value]);
    event.option.deselect();
    this.currentCreator.set("");
  }

  protected async addCreator(event: MatChipInputEvent) {
    const value = (event.value ?? "").trim();
    if (value) {
      let creator = this.creatorsService
        .creators()
        .find((creator) => creator.name.toLowerCase() === value.toLowerCase());
      creator ??= await this.creatorsService.add(value, null);
      this.attributeCreators.update((creators) => [...creators, creator]);
    }
    event.chipInput?.clear();
    this.currentCreator.set("");
  }

  protected removeTag(tag: Tag) {
    this.attributeTags.set(this.attributeTags().filter(t => t.id !== tag.id));
  }

  protected selectTag(event: MatAutocompleteSelectedEvent) {
    if (this.attributeTags().some(tag => tag.id === event.option.value.id)) {
      this.currentTag.set("");
      return;
    }
    this.attributeTags.update((tags) => [...tags, event.option.value]);
    event.option.deselect();
    this.currentTag.set("");
  }

  protected async addTag(event: MatChipInputEvent) {
    const value = (event.value ?? "").trim();
    if (value) {
      let tag = this.tagsService
        .tags()
        .find((tag) => tag.title.toLowerCase() === value.toLowerCase());
      tag ??= await this.tagsService.add(value);
      this.attributeTags.update((tags) => [...tags, tag]);
    }
    event.chipInput?.clear();
    this.currentTag.set("");
  }

}
