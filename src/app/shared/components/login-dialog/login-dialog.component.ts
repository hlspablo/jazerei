import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.scss"],
})
export class LoginDialogComponent {
  loginForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log(this.loginForm.value)
    }
  }
}
