import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"

@Component({
  selector: "app-publish-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>
  registrationForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private breakpointService: BreakpointService,
  ) {
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

  ngOnInit() {
    this.showHamburgerMenu = this.showHamburgerMenu =
      this.breakpointService.isHandsetOrSmall()
  }
}
