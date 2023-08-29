import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { AuthService } from "src/app/services/auth.service"

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
        this.dialog.closeAll()
      } catch (error) {
        console.log("Error from Login", error)
      } finally {
        this.isLoading = false
      }
    } else {
      console.log(this.loginForm.errors)
    }
  }
}
