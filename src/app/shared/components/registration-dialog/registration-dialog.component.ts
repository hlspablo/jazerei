import { Component, inject } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { cpfValidator } from "./cpf.validator"
import { registerErrorTranslate } from "src/app/utils/firebase.translate"
import { MatDialog } from "@angular/material/dialog"

@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
})
export class RegistrationDialogComponent {
  private fb = inject(NonNullableFormBuilder)
  private authService = inject(AuthService)
  private matDialog = inject(MatDialog)
  registerErrorMessage = ""
  isLoading = false

  protected registrationForm = this.fb.group({
    stepOne: this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    }),
    stepTwo: this.fb.group({
      name: ["", Validators.required],
      cpf: ["", [Validators.required, cpfValidator]],
    }),
  })

  async submit() {
    console.log("Submitting registration form")
    if (this.registrationForm.valid) {
      const values = this.registrationForm.value
      if (values) {
        try {
          this.registerErrorMessage = ""
          this.isLoading = true
          await this.authService.register({
            email: values.stepOne?.email || "",
            password: values.stepOne?.password || "",
            name: values.stepTwo?.name || "",
            cpf: values.stepTwo?.cpf || "",
          })
          this.matDialog.closeAll()
        } catch (error) {
          this.registerErrorMessage = registerErrorTranslate(error)
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
