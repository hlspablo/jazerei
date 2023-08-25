import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
})
export class RegistrationDialogComponent {
  registrationForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      stepOne: this.fb.group({
        name: ["", Validators.required],
        pass: ["", Validators.required],
      }),
      stepTwo: this.fb.group({
        phone: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
      }),
    })
  }
  submit() {
    console.log("Submitting registration form")
    if (this.registrationForm.valid) {
      const values = this.registrationForm.value
      console.log("Registration data:", values)
      // Handle submission logic here
    }
  }
}
