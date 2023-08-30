import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { AuthService } from "src/app/services/auth.service"
import { loginErrorTranslate } from "src/app/utils/firebase.translate"

interface LoginFormValues {
  email: string
  password: string
}

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"],
})
export class LoginDialogComponent {
  loginForm: FormGroup
  isLoading = false
  loginErrorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      const { email, password } = this.loginForm.value as LoginFormValues
      try {
        await this.authService.login(email, password)
        await new Promise((resolve) => setTimeout(resolve, 500)) // add one second delay for UX
        this.loginErrorMessage = ""
        this.dialog.closeAll()
      } catch (error) {
        this.loginErrorMessage = loginErrorTranslate(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
