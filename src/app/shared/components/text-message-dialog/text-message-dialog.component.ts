import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: "app-text-message-dialog",
  templateUrl: "./text-message-dialog.component.html",
  styleUrls: ["./text-message-dialog.component.scss"],
})
export class TextMessageDialogComponent implements OnInit {
  textMessageForm: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.textMessageForm = this.fb.group({
      message: ["", Validators.required],
    })
  }

  onSubmit(): void {
    if (this.textMessageForm.valid) {
      const message = this.textMessageForm.get("message")?.value
      // Implement your logic to send the message here
      console.log("Message to send:", message)
    }
  }
}
