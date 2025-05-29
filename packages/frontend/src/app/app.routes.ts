import type { Routes } from "@angular/router";
import { AuthenticationGuard } from "./authentication.guard";
import { CreatePostPage } from "./pages/create-post-page/create-post-page.component";
import { CreatorDetailsPage } from "./pages/creator-details-page/creator-details-page.component";
import { CreatorsPage } from "./pages/creators-page/creators-page.component";
import { ImportPage } from "./pages/import-page/import-page.component";
import { LandingPage } from "./pages/landing-page/landing-page.component";
import { LoginPage } from "./pages/login-page/login-page.component";
import { MainPage } from "./pages/main-page/main-page.component";
import { RegisterPage } from "./pages/register-page/register-page.component";
import { TagsPage } from "./pages/tags-page/tags-page.component";
import { WatchLaterPage } from "./pages/watch-later-page/watch-later-page.component";

export const routes: Routes = [
	{
		path: "create",
		component: CreatePostPage,
		title: "Bookmarks: Create Post",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "tags",
		component: TagsPage,
		title: "Bookmarks: Tags",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "creators",
		component: CreatorsPage,
		title: "Bookmarks: Creators",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "creator/:creatorId",
		component: CreatorDetailsPage,
		title: "Bookmarks: Creators",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "login",
		component: LoginPage,
		title: "Bookmarks: Login",
	},
	{
		path: "register",
		component: RegisterPage,
		title: "Bookmarks: Register",
	},
	{
		path: "watch-later",
		component: WatchLaterPage,
		title: "Bookmarks: Watch Later",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "import",
		component: ImportPage,
		title: "Bookmarks: Import",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "landing",
		component: LandingPage,
		title: "Bookmarks: Welcome!",
	},
	{
		path: "",
		component: MainPage,
		title: "Bookmarks: Home",
		canActivate: [AuthenticationGuard],
	},
	{
		path: "**",
		redirectTo: "/",
		pathMatch: "full",
	},
];
