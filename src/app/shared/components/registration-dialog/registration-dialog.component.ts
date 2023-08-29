import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { cpfValidator } from "./cpf.validator"

@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
})
export class RegistrationDialogComponent {
  registrationForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.registrationForm = this.fb.group({
      stepOne: this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
      }),
      stepTwo: this.fb.group({
        name: ["", Validators.required],
        cpf: ["", [Validators.required, cpfValidator]],
      }),
    })
  }
  submit() {
    console.log("Submitting registration form")
    if (this.registrationForm.valid) {
      const values = this.registrationForm.value
      this.authService.register({
        email: values.stepOne.email,
        password: values.stepOne.password,
        name: values.stepTwo.name,
        cpf: values.stepTwo.cpf,
      })
    }
  }
}
