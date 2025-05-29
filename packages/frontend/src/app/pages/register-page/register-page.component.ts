import { Component, inject, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { BackendService } from "../../services/backend.service";

@Component({
	selector: "app-register-page",
	imports: [
		FormsModule,
		RouterLink,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
	],
	templateUrl: "./register-page.component.html",
	styleUrl: "./register-page.component.scss",
})
export class RegisterPage {
	private readonly router = inject(Router);
	private readonly backend = inject(BackendService);
	private readonly snackbar = inject(MatSnackBar);
	private readonly authenticationService = inject(AuthenticationService);

	protected readonly username = model("");
	protected readonly password = model("");
	protected readonly passwordConfirm = model("");

	protected readonly isLoggingIn = signal(false);
	protected readonly passwordVisible = signal(false);

	protected register() {
		const username = this.username();
		const password = this.password();
		const passwordConfirm = this.passwordConfirm();

		if (!username || !password) {
			this.snackbar.open("Username and password are required", "Close", {
				duration: 3000,
			});
			return;
		}

		if (passwordConfirm !== password) {
			this.snackbar.open("Passwords do not match", "Close", { duration: 3000 });
			return;
		}

		this.isLoggingIn.set(true);
		this.backend.authentication
			.register({ username, password })
			.then(({ token }) => {
				this.authenticationService.setToken(token);
				this.router.navigate(["/"]);
				this.isLoggingIn.set(false);
			})
			.catch((error) => {
				console.error("Register failed:", error);
				this.snackbar.open(`Register failed: ${error.message}`, "Close", {
					duration: 3000,
				});
				this.passwordConfirm.set("");
				this.isLoggingIn.set(false);
			});
	}

	protected togglePasswordVisibility() {
		this.passwordVisible.update((visible) => !visible);
	}
}
