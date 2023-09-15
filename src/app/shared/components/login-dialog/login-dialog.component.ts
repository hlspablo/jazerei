import { Component, OnInit, inject } from "@angular/core"
import { Validators, NonNullableFormBuilder } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { AuthService } from "src/app/services/auth.service"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { loginErrorTranslate } from "src/app/utils/firebase.translate"
import { sleepFor } from "src/app/utils/time.utils"

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
  private _fb = inject(NonNullableFormBuilder)
  private _authService = inject(AuthService)
  private _dialogService = inject(MatDialog)

  protected isLoading = false
  protected loginErrorMessage = ""

  protected loginForm = this._fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  })

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      const { email, password } = this.loginForm.value as LoginFormValues
      try {
        await this._authService.login(email, password)
        await sleepFor(500)
        this.loginErrorMessage = ""
        this._dialogService.closeAll()
      } catch (error) {
        this.loginErrorMessage = loginErrorTranslate(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
